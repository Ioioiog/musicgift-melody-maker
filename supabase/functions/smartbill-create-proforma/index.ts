// File: smartbill-create-proforma.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

const generateSmartBillProformaXML = (data: any) => {
  const { companyVatCode, seriesName, client, issueDate, dueDate, currency, products, observations } = data
  const clientXml = `
    <client>
      <name>${client.name}</name>
      <vatCode>${client.vatCode || '-'}</vatCode>
      <regCom>${client.regCom || ''}</regCom>
      <address>${client.address || '-'}</address>
      <city>${client.city}</city>
      <county>${client.county}</county>
      <country>${client.country}</country>
      <email>${client.email || ''}</email>
      <isTaxPayer>true</isTaxPayer>
    </client>`

  const productsXml = products.map(p => `
<estimateProducts>
  <estimateProduct>
    <name>plusPackage - Cadou Muzical Personalizat</name>
    <code></code>
    <isDiscount>false</isDiscount>
    <quantity>1</quantity>
    <price>100</price>
    <currency>EUR</currency>
    <isTaxIncluded>true</isTaxIncluded>
    <taxName>Normala</taxName>
    <taxPercentage>19</taxPercentage>
    <isService>true</isService>
  </estimateProduct>
</estimateProducts>

  return `<?xml version="1.0" encoding="UTF-8"?>
  <estimate>
    <companyVatCode>${companyVatCode}</companyVatCode>
    <seriesName>${seriesName}</seriesName>
    ${clientXml}
    <issueDate>${issueDate}</issueDate>
    <dueDate>${dueDate}</dueDate>
    <deliveryDate>${dueDate}</deliveryDate>
    <isDraft>true</isDraft>
    <language>RO</language>
    <sendEmail>true</sendEmail>
    <currency>${currency}</currency>
    <precision>2</precision>
    <estimateProducts>
      ${productsXml}
    </estimateProducts>
    <observations>${observations || ''}</observations>
  </estimate>`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { orderData } = await req.json()

  const username = Deno.env.get('SMARTBILL_USERNAME')
  const token = Deno.env.get('SMARTBILL_TOKEN')
  const baseUrl = Deno.env.get('SMARTBILL_BASE_URL') || 'https://ws.smartbill.ro'
  const companyVatCode = Deno.env.get('SMARTBILL_COMPANY_VAT')!
  const seriesName = Deno.env.get('SMARTBILL_SERIES') || 'STRP'

  const invoiceType = orderData.form_data.invoiceType
  const isCompany = invoiceType === 'company'
  const currency = ['RON', 'EUR'].includes(orderData.currency) ? orderData.currency : 'RON'
  const issueDate = new Date().toISOString().split('T')[0]
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const client = {
    name: isCompany ? orderData.form_data.companyName || 'Firma' : orderData.form_data.fullName || 'Client',
    vatCode: isCompany ? orderData.form_data.vatCode || '-' : '-',
    regCom: isCompany ? orderData.form_data.registrationNumber || '' : '',
    address: orderData.form_data.address || '-',
    city: orderData.form_data.city || 'Bucuresti',
    county: orderData.form_data.county || 'Bucuresti',
    country: 'Romania',
    email: orderData.form_data.email || ''
  }

  const products = [{
    name: `${orderData.package_name} - Cadou Muzical Personalizat`,
    quantity: 1,
    price: orderData.total_price,
    currency
  }]

  const xmlBody = generateSmartBillProformaXML({
    companyVatCode,
    seriesName,
    client,
    issueDate,
    dueDate,
    currency,
    products,
    observations: `Comanda pentru ${orderData.form_data.recipientName || 'client'}`
  })

  const response = await fetch(`${baseUrl}/SBORO/api/estimate`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${username}:${token}`)}`,
      'Content-Type': 'application/xml',
      'Accept': 'application/xml'
    },
    body: xmlBody
  })

  const text = await response.text()
  if (!response.ok) {
    return new Response(JSON.stringify({ success: false, error: 'SmartBill XML error', message: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  }

  const urlMatch = text.match(/<url>(.*?)<\/url>/)
  const numberMatch = text.match(/<number>(.*?)<\/number>/)
  const url = urlMatch?.[1] || null
  const number = numberMatch?.[1] || null

  await supabase.from('orders').update({
    smartbill_invoice_id: number,
    smartbill_payment_url: url,
    smartbill_payment_status: 'pending'
  }).eq('id', orderData.id)

  return new Response(JSON.stringify({ success: true, number, url }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200
  })
})
