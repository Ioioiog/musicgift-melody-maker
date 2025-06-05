
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

const escapeXml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const generateSmartBillProformaXML = (data: any) => {
  const { companyVatCode, seriesName, client, issueDate, dueDate, currency, products, observations } = data
  
  const clientXml = `
    <client>
      <name>${escapeXml(client.name)}</name>
      <vatCode>${client.vatCode || ''}</vatCode>
      <regCom>${client.regCom || ''}</regCom>
      <address>${escapeXml(client.address || '')}</address>
      <city>${escapeXml(client.city || '')}</city>
      <county>${escapeXml(client.county || '')}</county>
      <country>${escapeXml(client.country || 'Romania')}</country>
      <email>${client.email || ''}</email>
      <isTaxPayer>${client.isTaxPayer ? 'true' : 'false'}</isTaxPayer>
    </client>`

  const productsXml = products.map((product: any) => `
    <product>
      <name>${escapeXml(product.name)}</name>
      <code>${product.code || ''}</code>
      <isDiscount>false</isDiscount>
      <measuringUnit>${product.measuringUnit || 'buc'}</measuringUnit>
      <quantity>${product.quantity}</quantity>
      <price>${product.price}</price>
      <productType>${product.productType || 'Serviciu'}</productType>
      <currency>${currency}</currency>
      <isTaxIncluded>true</isTaxIncluded>
      <taxName>Normala</taxName>
      <taxPercentage>19</taxPercentage>
      <isService>true</isService>
    </product>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<request>
  <companyVatCode>${companyVatCode}</companyVatCode>
  <seriesName>${seriesName}</seriesName>
  ${clientXml}
  <issueDate>${issueDate}</issueDate>
  <dueDate>${dueDate}</dueDate>
  <deliveryDate>${dueDate}</deliveryDate>
  <isDraft>false</isDraft>
  <language>RO</language>
  <sendEmail>true</sendEmail>
  <precision>2</precision>
  <currency>${currency}</currency>
  <products>
    ${productsXml}
  </products>
  <observations>${escapeXml(observations || '')}</observations>
</request>`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { orderData } = await req.json()

    console.log('📦 Processing SmartBill proforma for order:', orderData.id)

    const username = Deno.env.get('SMARTBILL_USERNAME')
    const token = Deno.env.get('SMARTBILL_TOKEN')
    const baseUrl = Deno.env.get('SMARTBILL_BASE_URL') || 'https://api.smartbill.ro'
    const companyVatCode = Deno.env.get('SMARTBILL_COMPANY_VAT')!
    const seriesName = Deno.env.get('SMARTBILL_SERIES') || 'PROV'

    if (!username || !token) {
      throw new Error('SmartBill credentials not configured')
    }

    const invoiceType = orderData.form_data?.invoiceType || 'individual'
    const isCompany = invoiceType === 'company'
    const currency = ['RON', 'EUR'].includes(orderData.currency) ? orderData.currency : 'RON'
    const issueDate = new Date().toISOString().split('T')[0]
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Convert price from cents to currency units if needed
    const totalPrice = typeof orderData.total_price === 'number' 
      ? (orderData.total_price > 1000 ? orderData.total_price / 100 : orderData.total_price)
      : parseFloat(orderData.total_price) || 0

    const client = {
      name: isCompany 
        ? (orderData.form_data?.companyName || 'Firma Necunoscuta') 
        : (orderData.form_data?.fullName || 'Client Necunoscut'),
      vatCode: isCompany ? (orderData.form_data?.vatCode || '') : '',
      regCom: isCompany ? (orderData.form_data?.registrationNumber || '') : '',
      address: orderData.form_data?.address || '',
      city: orderData.form_data?.city || 'Bucuresti',
      county: orderData.form_data?.county || 'Bucuresti',
      country: 'Romania',
      email: orderData.form_data?.email || '',
      isTaxPayer: isCompany && orderData.form_data?.vatCode
    }

    const products = [{
      name: `${orderData.package_name || 'Pachet Muzical'} - Cadou Muzical Personalizat`,
      code: '',
      quantity: 1,
      price: totalPrice,
      measuringUnit: 'buc',
      productType: 'Serviciu'
    }]

    const xmlBody = generateSmartBillProformaXML({
      companyVatCode,
      seriesName,
      client,
      issueDate,
      dueDate,
      currency,
      products,
      observations: `Comanda pentru ${orderData.form_data?.recipientName || 'client'} - Pachet: ${orderData.package_name || 'Necunoscut'}`
    })

    console.log('📤 Sending XML to SmartBill:', xmlBody.substring(0, 500) + '...')

    const response = await fetch(`${baseUrl}/estimate`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${token}`)}`,
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
      },
      body: xmlBody
    })

    const responseText = await response.text()
    console.log('📨 SmartBill response status:', response.status)
    console.log('📨 SmartBill response:', responseText)

    if (!response.ok) {
      console.error('❌ SmartBill API error:', responseText)
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'SmartBill API error', 
        message: responseText,
        status: response.status 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    // Parse XML response to extract key information
    let estimateNumber = null
    let estimateUrl = null
    let series = null

    try {
      const urlMatch = responseText.match(/<url>(.*?)<\/url>/)
      const numberMatch = responseText.match(/<number>(.*?)<\/number>/)
      const seriesMatch = responseText.match(/<series>(.*?)<\/series>/)
      
      estimateUrl = urlMatch?.[1] || null
      estimateNumber = numberMatch?.[1] || null
      series = seriesMatch?.[1] || null

      console.log('✅ Extracted from response:', { estimateNumber, estimateUrl, series })
    } catch (parseError) {
      console.warn('⚠️ Could not parse SmartBill response:', parseError)
    }

    // Update order with SmartBill proforma information
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        smartbill_invoice_id: estimateNumber,
        smartbill_payment_url: estimateUrl,
        smartbill_payment_status: 'pending'
      })
      .eq('id', orderData.id)

    if (updateError) {
      console.error('❌ Error updating order:', updateError)
    } else {
      console.log('✅ Order updated with SmartBill data')
    }

    return new Response(JSON.stringify({ 
      success: true, 
      estimateNumber, 
      estimateUrl, 
      series,
      message: 'Proforma created successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('💥 Function error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal error', 
      message: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  }
})
