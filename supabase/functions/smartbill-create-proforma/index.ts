
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Converts amount from cents to actual currency units for SmartBill
 * Stripe uses cents (e.g., 2500 cents = 25.00 EUR)
 * SmartBill expects actual currency values (e.g., 25.00 EUR)
 */
function convertCentsToEur(amountInCents: number): number {
  return amountInCents / 100;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { orderData } = await req.json()

    const username = Deno.env.get('SMARTBILL_USERNAME')!
    const token = Deno.env.get('SMARTBILL_TOKEN')!
    const baseUrl = Deno.env.get('SMARTBILL_BASE_URL') || 'https://ws.smartbill.ro'
    const companyVatCode = Deno.env.get('SMARTBILL_COMPANY_VAT')!
    const seriesName = 'STRP'

    const client = orderData.form_data
    const issueDate = new Date().toISOString().split('T')[0]
    const dueDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

    // Convert from cents to EUR - Stripe sends amounts in cents, SmartBill expects EUR
    const totalPriceInCents = parseFloat(orderData.total_price) || 0
    const totalPrice = convertCentsToEur(totalPriceInCents)
    
    console.log(`Converting amount: ${totalPriceInCents} cents -> ${totalPrice} EUR`)

    const currency = ['RON', 'EUR'].includes(orderData.currency) 

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<estimate>
  <companyVatCode>${companyVatCode}</companyVatCode>
  <client>
    <name>${escapeXml(client.fullName || 'Client Necunoscut')}</name>
    <vatCode>${escapeXml(client.vatCode || '')}</vatCode>
    <isTaxPayer>${client.vatCode ? 'true' : 'false'}</isTaxPayer>
    <address>${escapeXml(client.address || '')}</address>
    <city>${escapeXml(client.city || 'Bucuresti')}</city>
    <country>Romania</country>
    <email>${escapeXml(client.email || '')}</email>
  </client>
  <issueDate>${issueDate}</issueDate>
  <seriesName>${seriesName}</seriesName>
  <dueDate>${dueDate}</dueDate>
  <product>
    <name>${escapeXml(orderData.package_name || 'Produs MusicGift')}</name>
    <isDiscount>false</isDiscount>
    <measuringUnitName>buc</measuringUnitName>
    <currency>EUR</currency>
    <quantity>1</quantity>
    <price>${totalPrice}</price>
    <isTaxIncluded>true</isTaxIncluded>
    <taxName>Normala</taxName>
    <taxPercentage>19</taxPercentage>
    <saveToDb>false</saveToDb>
    <isService>false</isService>
  </product>
</estimate>`

    console.log('Generated XML for SmartBill:', xml)

    const response = await fetch(`${baseUrl}/SBORO/api/estimate`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${token}`)}`,
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
      },
      body: xml
    })

    const responseText = await response.text()
    console.log('SmartBill API Response:', responseText)
    
    if (!response.ok) {
      console.error('SmartBill API Error:', {
        status: response.status,
        statusText: response.statusText,
        response: responseText
      })
      return new Response(JSON.stringify({
        success: false,
        error: 'SmartBill API error',
        message: responseText,
        status: response.status
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 })
    }

    const urlMatch = responseText.match(/<url>(.*?)<\/url>/)
    const numberMatch = responseText.match(/<number>(.*?)<\/number>/)

    await supabase.from('orders').update({
      smartbill_proforma_status: 'completed',
      smartbill_proforma_id: numberMatch?.[1] || null,
      smartbill_payment_url: urlMatch?.[1] || null
    }).eq('id', orderData.id)

    return new Response(JSON.stringify({
      success: true,
      number: numberMatch?.[1] || null,
      url: urlMatch?.[1] || null
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 })
  } catch (err) {
    console.error('Edge function error:', err)
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  }
})
