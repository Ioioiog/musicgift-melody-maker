
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

    const body = await req.json()
    const order = body.orderData
    if (!order?.form_data?.fullName || !order?.form_data?.email) {
      throw new Error('Invalid order data: fullName and email are required')
    }

    console.log('🔄 Processing SmartBill invoice for order:', order.form_data.fullName)

    const { data: savedOrder, error: insertError } = await supabase
      .from('orders')
      .insert({
        ...order,
        status: 'pending',
        payment_status: 'pending',
        smartbill_payment_status: 'pending',
        payment_provider: 'smartbill'
      })
      .select()
      .single()

    if (insertError) throw insertError

    // === SmartBill invoice setup ===
    const SMARTBILL_EMAIL = Deno.env.get('SMARTBILL_EMAIL')!
    const SMARTBILL_TOKEN = Deno.env.get('SMARTBILL_TOKEN')!
    const SMARTBILL_VAT = Deno.env.get('SMARTBILL_COMPANY_VAT')!
    const SMARTBILL_SERIES = 'mng'
    const BASE_URL = 'https://ws.smartbill.ro'

    console.log('🔐 SmartBill Config Check:', {
      username: SMARTBILL_EMAIL 
      token: SMARTBILL_TOKEN 
      companyVat: SMARTBILL_VAT 
      series: SMARTBILL_SERIES
    })

    const today = new Date().toISOString().split('T')[0]
    const dueDate = new Date(Date.now()

    const priceRON = order.total_price
    const invoiceData = {
      companyVatCode: SMARTBILL_VAT,
      seriesName: SMARTBILL_SERIES,
      client: {
        name: order.form_data.fullName,
        vatCode: "",
        regCom: "",
        address: order.form_data.address ?? 'Adresa nespecificata',
        city: order.form_data.city ?? 'Bucuresti',
        county: order.form_data.county ?? 'Bucuresti',
        country: 'Romania',
        email: order.form_data.email,
        isTaxPayer: false,
        saveToDb: false
      },
      issueDate: today,
      dueDate,
      deliveryDate: dueDate,
      isDraft: false,
      language: 'RO',
      sendEmail: true,
      precision: 2,
      currency: order.currency,
      products: [{
        name: `${order.package_name} - Cântec Personalizat`,
        quantity: 1,
        price: RON,
        measuringUnitName: 'buc',
        currency: order.currency,
        isTaxIncluded: true,
        taxName: 'Normala',
        taxPercentage: 19,
        isDiscount: false,
        saveToDb: false,
        isService: true
      }],
      observations: `Cântec personalizat pentru ${order.form_data.recipientName ?? 'destinatar'}`
    }

    console.log('📋 SmartBill invoice data prepared for:', order.form_data.fullName)

    const auth = btoa(`${SMARTBILL_USERNAME}:${SMARTBILL_TOKEN}`)
    console.log('🚀 Calling SmartBill API...')
    
    const smartbillRes = await fetch(`${BASE_URL}/SBORO/api/invoice`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(invoiceData)
    })

    console.log('📬 SmartBill Response Status:', smartbillRes.status)
    
    const resultText = await smartbillRes.text()
    console.log('📄 SmartBill Raw Response:', resultText.substring(0, 500))
    
    let result
    try {
      result = JSON.parse(resultText)
    } catch (parseError) {
      console.error('❌ Failed to parse SmartBill response:', parseError)
      throw new Error(`SmartBill returned invalid response: ${resultText.substring(0, 200)}`)
    }

    if (!smartbillRes.ok || result?.errorText || result?.error) {
      const errorMsg = result?.errorText || result?.error || `HTTP ${smartbillRes.status}`
      console.error('❌ SmartBill API Error:', errorMsg)
      
      // Enhanced error diagnostics for authentication
      if (errorMsg.includes('535') || errorMsg.includes('authentication')) {
        console.error('🔍 Authentication Error Detected:')
        console.error('- Using SMARTBILL_USERNAME (not email):', SMARTBILL_USERNAME ? 'YES' : 'NO')
        console.error('- Username configured:', SMARTBILL_USERNAME ? 'YES' : 'NO') 
        console.error('- Token configured:', SMARTBILL_TOKEN ? 'YES' : 'NO')
        console.error('- Error details:', errorMsg)
      }
      
      await supabase
        .from('orders')
        .update({ 
          smartbill_payment_status: 'failed',
          smartbill_error: errorMsg
        })
        .eq('id', savedOrder.id)

      return new Response(JSON.stringify({
        success: true,
        orderId: savedOrder.id,
        message: 'Order created successfully - invoice will be generated manually',
        warning: `SmartBill error: ${errorMsg}`
      }), { headers: corsHeaders })
    }

    const invoiceNumber = result?.number ?? 'UNKNOWN'
    const paymentUrl = result?.url
    
    console.log('✅ SmartBill invoice created successfully:', {
      invoiceNumber,
      hasPaymentUrl: !!paymentUrl
    })

    await supabase
      .from('orders')
      .update({
        smartbill_invoice_id: invoiceNumber,
        smartbill_payment_url: paymentUrl,
        smartbill_invoice_data: result,
        smartbill_payment_status: 'created'
      })
      .eq('id', savedOrder.id)

    return new Response(JSON.stringify({
      success: true,
      orderId: savedOrder.id,
      paymentUrl,
      smartBillInvoiceId: invoiceNumber,
      message: 'Invoice created successfully with SmartBill'
    }), { headers: corsHeaders })

  } catch (err) {
    console.error('❌ Error in SmartBill integration:', err)
    return new Response(JSON.stringify({ 
      success: false,
      error: err.message 
    }), {
      headers: corsHeaders,
      status: 500
    })
  }
})
