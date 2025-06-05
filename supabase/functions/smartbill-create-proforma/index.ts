import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function buildSmartBillXMLProforma(order: any, client: any, series: string, companyVat: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<estimate>
  <companyVatCode>${companyVat}</companyVatCode>
  <seriesName>${series}</seriesName>
  <client>
    <name>${client.name}</name>
    <vatCode>${client.vatCode || ''}</vatCode>
    <regCom>${client.regCom || ''}</regCom>
    <address>${client.address || ''}</address>
    <city>${client.city || ''}</city>
    <county>${client.county || ''}</county>
    <country>${client.country}</country>
    <email>${client.email || ''}</email>
    <isTaxPayer>true</isTaxPayer>
    <saveToDb>false</saveToDb>
  </client>
  <issueDate>${order.issueDate}</issueDate>
  <dueDate>${order.dueDate}</dueDate>
  <deliveryDate>${order.dueDate}</deliveryDate>
  <isDraft>false</isDraft>
  <language>RO</language>
  <sendEmail>true</sendEmail>
  <precision>2</precision>
  <currency>${order.currency}</currency>
  <estimateProducts>
    <estimateProduct>
      <name>${order.package_name} - Cadou Musical</name>
      <quantity>1</quantity>
      <price>${order.total_price}</price>
      <currency>${order.currency}</currency>
      <measuringUnitName>buc</measuringUnitName>
      <isTaxIncluded>true</isTaxIncluded>
      <taxName>Normala</taxName>
      <taxPercentage>19</taxPercentage>
      <isDiscount>false</isDiscount>
      <saveToDb>false</saveToDb>
      <isService>true</isService>
    </estimateProduct>
  </estimateProducts>
</estimate>`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const { orderData } = await req.json()
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const { SMARTBILL_USERNAME, SMARTBILL_TOKEN, SMARTBILL_BASE_URL, SMARTBILL_COMPANY_VAT, SMARTBILL_SERIES } = Deno.env.toObject()
    const series = SMARTBILL_SERIES || 'STRP'
    const auth = btoa(`${SMARTBILL_USERNAME}:${SMARTBILL_TOKEN}`)

    const issueDate = new Date().toISOString().split('T')[0]
    const dueDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

    const client = {
      name: orderData.form_data?.fullName || 'Client',
      vatCode: '-',
      regCom: '',
      address: orderData.form_data?.address || '-',
      city: orderData.form_data?.city || 'Bucuresti',
      county: orderData.form_data?.county || 'Bucuresti',
      country: 'Romania',
      email: orderData.form_data?.email || ''
    }

    const xmlPayload = buildSmartBillXMLProforma({
      ...orderData,
      issueDate,
      dueDate
    }, client, series, SMARTBILL_COMPANY_VAT || '')

    const res = await fetch(`${SMARTBILL_BASE_URL || 'https://ws.smartbill.ro'}/SBORO/api/estimate`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
      },
      body: xmlPayload
    })

    const text = await res.text()
    console.log('SmartBill XML Response:', text)

    if (!res.ok || text.includes('<errorText>')) {
      await supabase.from('orders').update({ smartbill_payment_status: 'failed' }).eq('id', orderData.id)
      return new Response(JSON.stringify({ success: false, error: 'SmartBill XML error', message: text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    await supabase.from('orders').update({ smartbill_payment_status: 'pending', smartbill_invoice_data: text }).eq('id', orderData.id)
    return new Response(JSON.stringify({ success: true, message: 'SmartBill proforma created (XML)', response: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error('Error:', err)
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
