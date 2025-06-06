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
        
        // SmartBill returns empty errorText for success, so check if it's actually an error
        if (smartbillRes.status !== 200 || (result?.errorText && result.errorText.trim() !== "")) {
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
      }

      // Extract invoice details from SmartBill response
      const invoiceNumber = result?.number ?? 'UNKNOWN'
      const invoiceSeries = result?.series ?? SMARTBILL_SERIES
      const paymentUrl = result?.url // Direct URL from SmartBill response
      const message = result?.message || 'Invoice created successfully'
      const errorText = result?.errorText || ''

      // Determine document type based on series
      const isProforma = invoiceSeries === 'STRP' || invoiceSeries === 'Prof' || invoiceSeries.toLowerCase().includes('prof')
      const documentType = isProforma ? 'proforma' : 'invoice'

      console.log('SmartBill response details:', {
        number: invoiceNumber,
        series: invoiceSeries, 
        documentType: documentType,
        url: paymentUrl,
        message: message,
        errorText: errorText
      })

      // Update order with proforma/invoice and payment info
      const updateData = {
        smartbill_payment_url: paymentUrl,
        payment_url: paymentUrl,
        smartbill_invoice_data: JSON.stringify({
          ...result,
          created_at: new Date().toISOString(),
          document_type: documentType
        }),
        smartbill_payment_status: paymentUrl ? 'proforma_created_with_payment_link' : 'document_created_no_payment_link'
      }

      if (isProforma) {
        // Store as proforma
        updateData.smartbill_proforma_id = `${invoiceSeries}${invoiceNumber}`
        updateData.smartbill_proforma_data = JSON.stringify(result)
        updateData.smartbill_proforma_status = 'created'
      } else {
        // Store as final invoice
        updateData.smartbill_invoice_id = `${invoiceSeries}${invoiceNumber}`
      }

      await supabase
        .from('orders')
        .update(updateData)
        .eq('id', savedOrder.id)

      console.log(`✅ ${documentType} ${invoiceSeries}${invoiceNumber} created successfully`)
      console.log(`🔗 Payment URL: ${paymentUrl || 'NOT GENERATED'}`)

      return new Response(JSON.stringify({
        success: true,
        orderId: savedOrder.id,
        documentType: documentType,
        documentNumber: `${invoiceSeries}${invoiceNumber}`,
        invoiceNumber: `${invoiceSeries}${invoiceNumber}`, // Keep for backwards compatibility
        paymentUrl,
        redirectToPayment: !!paymentUrl,
        pollForStatus: true,
        message: paymentUrl 
          ? `${isProforma ? 'Proforma' : 'Factură'} creată cu succes. Vei fi redirecționat către pagina de plată.`
          : `${isProforma ? 'Proforma' : 'Factură'} creată cu succes.`,
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

      // Check what document we have (proforma or invoice)
      const hasProforma = !!order.smartbill_proforma_id
      const hasInvoice = !!order.smartbill_invoice_id
      
      if (!hasProforma && !hasInvoice) {
        throw new Error('No SmartBill document found for this order')
      }

      // If already confirmed, return immediately
      if (order.payment_status === 'completed') {
        return new Response(JSON.stringify({
          success: true,
          paymentStatus: 'completed',
          message: 'Plata deja confirmată!'
        }), { headers: corsHeaders })
      }

      // Determine which document to check
      const documentId = hasProforma ? order.smartbill_proforma_id : order.smartbill_invoice_id
      const documentType = hasProforma ? 'proforma' : 'invoice'
      
      // Extract series and number from document ID
      const seriesMatch = documentId.match(/^([a-zA-Z]+)/)
      const numberMatch = documentId.match(/(\d+)$/)
      
      if (!seriesMatch || !numberMatch) {
        throw new Error(`Invalid ${documentType} ID format: ${documentId}`)
      }

      const series = seriesMatch[1]
      const number = numberMatch[1]

      // Check payment status with SmartBill API
      const SMARTBILL_EMAIL = Deno.env.get('SMARTBILL_EMAIL')!
      const SMARTBILL_TOKEN = Deno.env.get('SMARTBILL_TOKEN')!
      const SMARTBILL_VAT = Deno.env.get('SMARTBILL_COMPANY_VAT')!
      const BASE_URL = 'https://ws.smartbill.ro'
      
      const auth = btoa(`${SMARTBILL_EMAIL}:${SMARTBILL_TOKEN}`)

      console.log(`Checking ${documentType} payment status: ${series}${number}`)

      // Query payment status from SmartBill - WITH RATE LIMITING
      const statusCheckRes = await rateLimitedFetch(
        `${BASE_URL}/SBORO/api/invoice/paymentstatus?cif=${SMARTBILL_VAT}&seriesname=${series}&number=${number}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json'
        }
      })

      if (statusCheckRes.ok) {
        const statusResult = await statusCheckRes.json()
        console.log(`${documentType} payment status response:`, statusResult)
        
        // Check if document is fully paid using the correct SmartBill response structure
        const invoiceTotalAmount = statusResult?.invoiceTotalAmount || 0
        const paidAmount = statusResult?.paidAmount || 0
        const unpaidAmount = statusResult?.unpaidAmount || 0
        
        // Document is paid if paidAmount equals invoiceTotalAmount OR unpaidAmount is 0
        const isPaid = (paidAmount > 0 && unpaidAmount === 0) || (paidAmount >= invoiceTotalAmount && invoiceTotalAmount > 0)
        
        console.log(`Payment status: Total=${invoiceTotalAmount}, Paid=${paidAmount}, Unpaid=${unpaidAmount}, IsPaid=${isPaid}`)

        if (isPaid && order.payment_status !== 'completed') {
          // Payment confirmed - now create final invoice if we only have proforma
          let finalInvoiceCreated = false
          let finalInvoiceNumber = null

          if (hasProforma && !hasInvoice) {
            console.log('Payment confirmed on proforma - creating final invoice...')
            
            try {
              // Create final invoice with "mng" series
              const finalInvoiceData = {
                companyVatCode: SMARTBILL_VAT,
                seriesName: 'mng', // Final invoice series
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
                issueDate: new Date().toISOString().split('T')[0],
                dueDate: new Date().toISOString().split('T')[0], // Already paid
                deliveryDate: new Date().toISOString().split('T')[0],
                isDraft: false,
                language: 'RO',
                sendEmail: true,
                precision: 2,
                currency: order.currency || 'RON',
                products: [{
                  name: `${order.package_name} - Cântec Personalizat`,
                  quantity: 1,
                  price: order.total_price,
                  measuringUnitName: 'buc',
                  currency: order.currency || 'RON',
                  isTaxIncluded: true,
                  taxName: 'Normala',
                  taxPercentage: 19,
                  isDiscount: false,
                  saveToDb: false,
                  isService: true
                }],
                observations: `Cântec personalizat pentru ${order.form_data.recipientName ?? 'destinatar'}. Plată confirmată prin Netopia. Proforma: ${documentId}`
              }

              const finalInvoiceRes = await rateLimitedFetch(`${BASE_URL}/SBORO/api/invoice`, {
                method: 'POST',
                headers: {
                  'Authorization': `Basic ${auth}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify(finalInvoiceData)
              })

              if (finalInvoiceRes.ok) {
                const finalInvoiceText = await finalInvoiceRes.text()
                const finalInvoiceResult = JSON.parse(finalInvoiceText)
                
                if (!finalInvoiceResult?.errorText || finalInvoiceResult.errorText.trim() === "") {
                  finalInvoiceNumber = `${finalInvoiceResult.series || 'mng'}${finalInvoiceResult.number}`
                  finalInvoiceCreated = true
                  console.log(`✅ Final invoice created: ${finalInvoiceNumber}`)
                }
              }
            } catch (invoiceError) {
              console.error('Failed to create final invoice:', invoiceError)
            }
          }

          // Update order with payment confirmation and final invoice (if created)
          const updateData = {
            payment_status: 'completed',
            smartbill_payment_status: 'confirmed',
            status: 'completed',
            webhook_processed_at: new Date().toISOString(),
            smartbill_invoice_data: JSON.stringify({
              ...JSON.parse(order.smartbill_invoice_data || '{}'),
              payment_confirmed: statusResult,
              confirmed_at: new Date().toISOString(),
              final_invoice_created: finalInvoiceCreated
            })
          }

          if (finalInvoiceCreated && finalInvoiceNumber) {
            updateData.smartbill_invoice_id = finalInvoiceNumber
          }

          await supabase
            .from('orders')
            .update(updateData)
            .eq('id', orderId)

          console.log(`✅ Payment confirmed for order ${orderId}`)

          return new Response(JSON.stringify({
            success: true,
            paymentStatus: 'completed',
            message: 'Plata confirmată cu succes!',
            finalInvoice: finalInvoiceNumber,
            paymentDetails: {
              total: invoiceTotalAmount,
              paid: paidAmount,
              unpaid: unpaidAmount
            }
          }), { headers: corsHeaders })
        }

        return new Response(JSON.stringify({
          success: true,
          paymentStatus: isPaid ? 'completed' : 'pending',
          message: isPaid ? 'Plata confirmată!' : 'Plata în așteptare...',
          documentType: documentType,
          documentNumber: documentId,
          paymentDetails: {
            total: invoiceTotalAmount,
            paid: paidAmount,
            unpaid: unpaidAmount
          }
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