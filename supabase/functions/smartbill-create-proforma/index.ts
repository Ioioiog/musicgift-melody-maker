import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
}

// Rate limiting for SmartBill API (max 3 calls per second)
let lastApiCall = 0
const API_RATE_LIMIT = 334 // ms between calls (slightly more than 333ms for safety)

async function rateLimitedFetch(url: string, options: RequestInit) {
  const now = Date.now()
  const timeSinceLastCall = now - lastApiCall
  
  if (timeSinceLastCall < API_RATE_LIMIT) {
    await new Promise(resolve => setTimeout(resolve, API_RATE_LIMIT - timeSinceLastCall))
  }
  
  lastApiCall = Date.now()
  return fetch(url, options)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const url = new URL(req.url)
    const pathname = url.pathname
    
    console.log('SmartBill API Request:', pathname, req.method)

    // Handle invoice creation with Netopia payment link (default endpoint)
    if (pathname.includes('create-invoice-with-payment') || pathname.endsWith('smartbill-create-invoice') || req.method === 'POST') {
      const body = await req.json()
      const order = body.orderData

      if (!order?.form_data?.fullName || !order?.form_data?.email) {
        throw new Error('Invalid order data: fullName and email are required')
      }

      // Save order to database first
      const { data: savedOrder, error: insertError } = await supabase
        .from('orders')
        .insert({
          ...order,
          status: 'pending',
          payment_status: 'pending',
          smartbill_payment_status: 'pending',
          payment_provider: 'netopia'
        })
        .select()
        .single()

      if (insertError) throw insertError

      // SmartBill Config - CORRECTED BASE URL
      const SMARTBILL_EMAIL = Deno.env.get('SMARTBILL_EMAIL')!
      const SMARTBILL_TOKEN = Deno.env.get('SMARTBILL_TOKEN')!
      const SMARTBILL_VAT = Deno.env.get('SMARTBILL_COMPANY_VAT')!
      const SMARTBILL_SERIES = Deno.env.get('SMARTBILL_SERIES') || 'mng'
      const BASE_URL = 'https://ws.smartbill.ro' // CORRECTED URL

      const today = new Date().toISOString().split('T')[0]
      const dueDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
      const priceRON = order.total_price // Netopia works with actual amounts

      // Validate required data
      if (!SMARTBILL_EMAIL || !SMARTBILL_TOKEN || !SMARTBILL_VAT) {
        throw new Error('Missing required SmartBill configuration')
      }

      // Create invoice with automatic Netopia payment link generation
      const invoiceData = {
        companyVatCode: SMARTBILL_VAT,
        seriesName: SMARTBILL_SERIES,
        client: {
          name: order.form_data.fullName,
          vatCode: '',
          regCom: '',
          address: order.form_data.address ?? 'Adresa nespecificata',
          city: order.form_data.city ?? 'Bucuresti',
          county: order.form_data.county ?? 'Bucuresti',
          country: 'Romania',
          email: order.form_data.email,
          phone: order.form_data.phone || '',
          isTaxPayer: false,
          saveToDb: false
        },
        issueDate: today,
        dueDate,
        deliveryDate: dueDate,
        isDraft: false, // Create final invoice directly
        language: 'RO',
        sendEmail: true,
        precision: 2,
        currency: order.currency || 'RON',
        // Generate Netopia payment link automatically
        paymentUrl: "Generate URL",
        products: [{
          name: `${order.package_name} - Cântec Personalizat`,
          quantity: 1,
          price: priceRON,
          measuringUnitName: 'buc',
          currency: order.currency || 'RON',
          isTaxIncluded: true,
          taxName: 'Normala',
          taxPercentage: 19,
          isDiscount: false,
          saveToDb: false,
          isService: true
        }],
        observations: `Cântec personalizat pentru ${order.form_data.recipientName ?? 'destinatar'}. ID comandă: ${savedOrder.id}`
      }

      const auth = btoa(`${SMARTBILL_EMAIL}:${SMARTBILL_TOKEN}`)

      console.log('Creating SmartBill invoice with payment link...')

      // Create invoice with payment link through SmartBill - WITH RATE LIMITING
      const smartbillRes = await rateLimitedFetch(`${BASE_URL}/SBORO/api/invoice`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      })

      const resultText = await smartbillRes.text()
      console.log('SmartBill API Response Status:', smartbillRes.status)
      console.log('SmartBill API Response:', resultText.substring(0, 500))

      let result
      try {
        result = JSON.parse(resultText)
      } catch {
        throw new Error(`SmartBill returned invalid JSON: ${resultText.substring(0, 200)}`)
      }

      if (!smartbillRes.ok || result?.errorText || result?.error) {
        const errorMsg = result?.errorText || result?.error || `HTTP ${smartbillRes.status}: ${resultText}`
        
        await supabase
          .from('orders')
          .update({
            smartbill_payment_status: 'failed',
            smartbill_invoice_data: JSON.stringify({ 
              error: errorMsg, 
              timestamp: new Date().toISOString(),
              response: result
            })
          })
          .eq('id', savedOrder.id)

        throw new Error(`SmartBill invoice creation failed: ${errorMsg}`)
      }

      const invoiceNumber = result?.number ?? 'UNKNOWN'
      const invoiceSeries = result?.series ?? SMARTBILL_SERIES
      const paymentUrl = result?.url // Netopia payment URL
      const message = result?.message || 'Invoice created successfully'

      // Update order with invoice and payment info
      await supabase
        .from('orders')
        .update({
          smartbill_invoice_id: `${invoiceSeries}${invoiceNumber}`,
          smartbill_payment_url: paymentUrl,
          payment_url: paymentUrl,
          smartbill_invoice_data: JSON.stringify({
            ...result,
            created_at: new Date().toISOString()
          }),
          smartbill_payment_status: 'invoice_created_with_payment_link'
        })
        .eq('id', savedOrder.id)

      console.log(`✅ Invoice ${invoiceSeries}${invoiceNumber} created successfully`)

      return new Response(JSON.stringify({
        success: true,
        orderId: savedOrder.id,
        invoiceNumber: `${invoiceSeries}${invoiceNumber}`,
        paymentUrl,
        redirectToPayment: true,
        pollForStatus: true,
        message: 'Factură creată cu succes. Vei fi redirecționat către pagina de plată.',
        invoiceMessage: message
      }), { headers: corsHeaders })

    // Handle payment status checking (polling SmartBill)
    } else if (pathname.includes('check-payment-status')) {
      const body = await req.json()
      const { orderId } = body

      if (!orderId) {
        throw new Error('Order ID is required for payment status check')
      }

      console.log('Checking payment status for order:', orderId)

      // Get order from database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (orderError || !order) {
        throw new Error('Order not found')
      }

      if (!order.smartbill_invoice_id) {
        throw new Error('No SmartBill invoice found for this order')
      }

      // If already confirmed, return immediately
      if (order.payment_status === 'completed') {
        return new Response(JSON.stringify({
          success: true,
          paymentStatus: 'completed',
          message: 'Plata deja confirmată!'
        }), { headers: corsHeaders })
      }

      // Extract series and number from invoice ID
      const invoiceId = order.smartbill_invoice_id
      const seriesMatch = invoiceId.match(/^([a-zA-Z]+)/)
      const numberMatch = invoiceId.match(/(\d+)$/)
      
      if (!seriesMatch || !numberMatch) {
        throw new Error('Invalid invoice ID format')
      }

      const series = seriesMatch[1]
      const number = numberMatch[1]

      // Check payment status with SmartBill API
      const SMARTBILL_EMAIL = Deno.env.get('SMARTBILL_EMAIL')!
      const SMARTBILL_TOKEN = Deno.env.get('SMARTBILL_TOKEN')!
      const SMARTBILL_VAT = Deno.env.get('SMARTBILL_COMPANY_VAT')!
      const BASE_URL = 'https://ws.smartbill.ro'
      
      const auth = btoa(`${SMARTBILL_EMAIL}:${SMARTBILL_TOKEN}`)

      console.log(`Checking invoice status: ${series}${number}`)

      // Query invoice status from SmartBill - WITH RATE LIMITING
      const statusCheckRes = await rateLimitedFetch(
        `${BASE_URL}/SBORO/api/invoice?cif=${SMARTBILL_VAT}&seriesName=${series}&number=${number}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json'
        }
      })

      if (statusCheckRes.ok) {
        const statusResult = await statusCheckRes.json()
        console.log('Invoice status response:', statusResult)
        
        // Check if invoice is marked as paid
        const isPaid = statusResult?.status === 'paid' || 
                      statusResult?.paid === true || 
                      statusResult?.paymentStatus === 'paid' ||
                      statusResult?.collected === true

        if (isPaid && order.payment_status !== 'completed') {
          // Payment confirmed - update order
          await supabase
            .from('orders')
            .update({
              payment_status: 'completed',
              smartbill_payment_status: 'confirmed',
              status: 'completed',
              webhook_processed_at: new Date().toISOString(),
              smartbill_invoice_data: JSON.stringify({
                ...JSON.parse(order.smartbill_invoice_data || '{}'),
                payment_confirmed: statusResult,
                confirmed_at: new Date().toISOString()
              })
            })
            .eq('id', orderId)

          console.log(`✅ Payment confirmed for order ${orderId}`)

          return new Response(JSON.stringify({
            success: true,
            paymentStatus: 'completed',
            message: 'Plata confirmată cu succes!'
          }), { headers: corsHeaders })
        }

        return new Response(JSON.stringify({
          success: true,
          paymentStatus: isPaid ? 'completed' : 'pending',
          message: isPaid ? 'Plata confirmată!' : 'Plata în așteptare...',
          invoiceStatus: statusResult
        }), { headers: corsHeaders })
      }

      // If API call fails, return current status
      console.log('SmartBill status check failed:', statusCheckRes.status)
      
      return new Response(JSON.stringify({
        success: true,
        paymentStatus: order.payment_status || 'pending',
        message: 'Verificare status în curs...',
        apiError: `Status check failed: ${statusCheckRes.status}`
      }), { headers: corsHeaders })

    } else {
      // Invalid endpoint
      throw new Error(`Invalid endpoint: ${pathname}. Use /create-invoice-with-payment or /check-payment-status`)
    }

  } catch (err) {
    console.error('❌ SmartBill Integration Error:', err)
    return new Response(JSON.stringify({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString()
    }), { headers: corsHeaders, status: 500 })
  }
})