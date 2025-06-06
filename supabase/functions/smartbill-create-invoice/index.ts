
import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const url = new URL(req.url)
    const endpoint = url.pathname.split('/').pop()

    // Handle invoice creation with Netopia payment link
    if (endpoint === 'create-invoice-with-payment' || !endpoint) {
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

      // SmartBill Config
      const SMARTBILL_EMAIL = Deno.env.get('SMARTBILL_EMAIL')!
      const SMARTBILL_TOKEN = Deno.env.get('SMARTBILL_TOKEN')!
      const SMARTBILL_VAT = Deno.env.get('SMARTBILL_COMPANY_VAT')!
      const SMARTBILL_SERIES = Deno.env.get('SMARTBILL_SERIES') || 'mng'
      const BASE_URL = 'https://ws.smartbill.ro'

      const today = new Date().toISOString().split('T')[0]
      const dueDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
      const priceRON = order.total_price

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
        isDraft: true,
        language: 'RO',
        sendEmail: true,
        precision: 2,
        currency: order.currency || 'RON',
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
        observations: `DRAFT - Cântec personalizat pentru ${order.form_data.recipientName ?? 'destinatar'}. ID comandă: ${savedOrder.id}. Convertit în factură după plată.`
      }

      const auth = btoa(`${SMARTBILL_EMAIL}:${SMARTBILL_TOKEN}`)

      const smartbillRes = await fetch(`${BASE_URL}/SBORO/api/invoice`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      })

      const resultText = await smartbillRes.text()
      let result
      try {
        result = JSON.parse(resultText)
      } catch {
        throw new Error(`SmartBill returned invalid response: ${resultText.substring(0, 200)}`)
      }

      if (!smartbillRes.ok || result?.errorText || result?.error) {
        const errorMsg = result?.errorText || result?.error || `HTTP ${smartbillRes.status}`
        await supabase
          .from('orders')
          .update({
            smartbill_payment_status: 'failed',
            smartbill_invoice_data: JSON.stringify({ error: errorMsg, timestamp: new Date().toISOString() })
          })
          .eq('id', savedOrder.id)

        throw new Error(`SmartBill invoice creation failed: ${errorMsg}`)
      }

      const invoiceNumber = result?.number ?? 'UNKNOWN'
      const invoiceSeries = result?.series
      const paymentUrl = result?.url
      const message = result?.message

      await supabase
        .from('orders')
        .update({
          smartbill_invoice_id: `${invoiceSeries}${invoiceNumber}`,
          smartbill_payment_url: paymentUrl,
          payment_url: paymentUrl,
          smartbill_invoice_data: JSON.stringify(result),
          smartbill_payment_status: 'draft_created_with_payment_link'
        })
        .eq('id', savedOrder.id)

      return new Response(JSON.stringify({
        success: true,
        orderId: savedOrder.id,
        invoiceNumber: `${invoiceSeries}${invoiceNumber}`,
        paymentUrl,
        redirectToPayment: true,
        message: 'Factură draft creată cu succes. Vei fi redirecționat către pagina de plată.',
        invoiceMessage: message || 'Factura draft a fost trimisă pe email.'
      }), { headers: corsHeaders })
    }

    // Handle payment confirmation webhook from Netopia
    if (endpoint === 'payment-webhook') {
      const body = await req.json()
      console.log('Payment webhook received:', JSON.stringify(body, null, 2))
      
      // Extract order ID from webhook data using multiple methods
      let orderId = body.orderId || body.order_id || body.customOrderId || body.orderNumber
      
      // Method 2: Extract from invoice observations/description
      if (!orderId && body.description) {
        const match = body.description.match(/ID comandă: ([a-f0-9-]+)/)
        if (match) orderId = match[1]
      }
      
      // Method 3: Extract from invoice number
      if (!orderId && body.invoiceNumber && body.invoiceNumber.includes('-')) {
        const parts = body.invoiceNumber.split('-')
        if (parts.length > 1) orderId = parts[parts.length - 1]
      }
      
      // Method 4: Search database by invoice ID
      if (!orderId && (body.invoiceId || body.invoice_id)) {
        const invoiceId = body.invoiceId || body.invoice_id
        const { data: orderByInvoice } = await supabase
          .from('orders')
          .select('id')
          .eq('smartbill_invoice_id', invoiceId)
          .single()
        
        if (orderByInvoice) orderId = orderByInvoice.id
      }
      
      const errorCode = body.errorCode || body.status || body.error_code
      const errorMessage = body.errorMessage || body.message || body.error_message
      
      if (!orderId) {
        console.log('Payment webhook received but no order ID found. Webhook data:', JSON.stringify(body, null, 2))
        
        // Try to create webhook_logs table entry if it exists
        try {
          await supabase
            .from('webhook_logs')
            .insert({
              type: 'payment_webhook_unmatched',
              data: body,
              timestamp: new Date().toISOString()
            })
        } catch (webhookLogError) {
          console.log('Could not log webhook (table may not exist):', webhookLogError)
        }
        
        return new Response('OK - No order ID found', { headers: corsHeaders })
      }

      // Get order from database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (orderError || !order) {
        console.error('Order not found for payment webhook:', orderId)
        return new Response('Order not found', { headers: corsHeaders, status: 404 })
      }

      // Check if payment was successful
      const isPaymentSuccessful = errorCode === '0' || errorCode === 0 || errorCode === 'confirmed' || errorCode === 'success'

      if (isPaymentSuccessful) {
        // Payment successful - create final invoice
        const SMARTBILL_EMAIL = Deno.env.get('SMARTBILL_EMAIL')!
        const SMARTBILL_TOKEN = Deno.env.get('SMARTBILL_TOKEN')!
        const SMARTBILL_VAT = Deno.env.get('SMARTBILL_COMPANY_VAT')!
        const SMARTBILL_SERIES = Deno.env.get('SMARTBILL_SERIES') || 'mng'
        const BASE_URL = 'https://ws.smartbill.ro'

        const today = new Date().toISOString().split('T')[0]
        const priceRON = order.total_price

        const finalInvoiceData = {
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
          dueDate: today,
          deliveryDate: today,
          isDraft: false,
          language: 'RO',
          sendEmail: true,
          precision: 2,
          currency: order.currency || 'RON',
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
          observations: `Cântec personalizat pentru ${order.form_data.recipientName ?? 'destinatar'}. Plată confirmată prin Netopia. ID comandă: ${orderId}`
        }

        const auth = btoa(`${SMARTBILL_EMAIL}:${SMARTBILL_TOKEN}`)

        // Create final invoice
        const finalInvoiceRes = await fetch(`${BASE_URL}/SBORO/api/invoice`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(finalInvoiceData)
        })

        const finalInvoiceText = await finalInvoiceRes.text()
        let finalInvoiceResult
        try {
          finalInvoiceResult = JSON.parse(finalInvoiceText)
        } catch {
          console.error('Failed to parse final invoice response:', finalInvoiceText)
        }

        const updateData = {
          payment_status: 'completed',
          smartbill_payment_status: 'confirmed',
          status: 'confirmed',
          webhook_processed_at: new Date().toISOString()
        }

        if (finalInvoiceRes.ok && finalInvoiceResult && !finalInvoiceResult.errorText && !finalInvoiceResult.error) {
          const finalInvoiceNumber = finalInvoiceResult?.number ?? 'UNKNOWN'
          const finalInvoiceSeries = finalInvoiceResult?.series
          
          updateData.smartbill_invoice_id = `${finalInvoiceSeries}${finalInvoiceNumber}`
          updateData.smartbill_invoice_data = JSON.stringify({
            draft: JSON.parse(order.smartbill_invoice_data || '{}'),
            final: finalInvoiceResult,
            timestamp: new Date().toISOString()
          })

          console.log(`✅ Payment confirmed and final invoice ${finalInvoiceSeries}${finalInvoiceNumber} created for order ${orderId}`)
        } else {
          const invoiceError = finalInvoiceResult?.errorText || finalInvoiceResult?.error || 'Unknown invoice error'
          console.error(`⚠️ Payment confirmed but final invoice creation failed for order ${orderId}:`, invoiceError)
          
          updateData.smartbill_invoice_data = JSON.stringify({
            draft: JSON.parse(order.smartbill_invoice_data || '{}'),
            final_error: invoiceError,
            timestamp: new Date().toISOString()
          })
          updateData.status = 'payment_confirmed_invoice_pending'
        }

        await supabase
          .from('orders')
          .update(updateData)
          .eq('id', orderId)

        console.log(`✅ Payment confirmed for order ${orderId}`)

      } else {
        // Payment failed
        await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            smartbill_payment_status: 'failed',
            smartbill_invoice_data: JSON.stringify({ 
              error: errorMessage || `Error code: ${errorCode}`, 
              timestamp: new Date().toISOString(),
              webhook_data: body 
            }),
            webhook_processed_at: new Date().toISOString()
          })
          .eq('id', orderId)

        console.log(`❌ Payment failed for order ${orderId}. Error: ${errorCode} - ${errorMessage}`)
      }

      return new Response('OK', { headers: corsHeaders })
    }

    throw new Error('Invalid endpoint. Use /create-invoice-with-payment or /payment-webhook')

  } catch (err) {
    console.error('❌ SmartBill Netopia Integration Error:', err)
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), { headers: corsHeaders, status: 500 })
  }
})
