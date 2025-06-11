
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting for SmartBill API (max 3 calls per second)
let lastApiCall = 0
const API_RATE_LIMIT = 334 // ms between calls

async function rateLimitedFetch(url: string, options: RequestInit) {
  const now = Date.now()
  const timeSinceLastCall = now - lastApiCall
  
  if (timeSinceLastCall < API_RATE_LIMIT) {
    await new Promise(resolve => setTimeout(resolve, API_RATE_LIMIT - timeSinceLastCall))
  }
  
  lastApiCall = Date.now()
  return fetch(url, options)
}

function escapeXml(value: string): string {
  if (!value) return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { giftCardId } = await req.json()
    console.log('Creating post-payment proforma for gift card:', giftCardId)

    // Get gift card details
    const { data: giftCard, error: giftError } = await supabaseClient
      .from('gift_cards')
      .select('*')
      .eq('id', giftCardId)
      .single()

    if (giftError || !giftCard) {
      console.error('Gift card error:', giftError)
      throw new Error('Gift card not found')
    }

    // Only create proforma for successfully paid gift cards
    if (giftCard.payment_status !== 'completed') {
      throw new Error('Cannot create proforma for unpaid gift card')
    }

    // Validate SmartBill configuration
    const username = Deno.env.get('SMARTBILL_USERNAME')
    const token = Deno.env.get('SMARTBILL_TOKEN')
    const baseUrl = Deno.env.get('SMARTBILL_BASE_URL') || 'https://ws.smartbill.ro'
    const companyVat = Deno.env.get('SMARTBILL_COMPANY_VAT')

    if (!username || !token || !companyVat) {
      throw new Error('SmartBill configuration incomplete')
    }

    const paymentAmount = giftCard.currency === 'EUR' 
      ? (giftCard.amount_ron || (giftCard.gift_amount * 5)) 
      : giftCard.gift_amount;

    const finalAmount = paymentAmount / 100;

    // Calculate dates
    const issueDate = new Date().toISOString().split('T')[0]
    const dueDate = new Date().toISOString().split('T')[0] // Already paid, so due date is today

    // Create proforma as receipt for completed payment
    const proformaXml = `<?xml version="1.0" encoding="UTF-8"?>
<estimate>
  <companyVatCode>${escapeXml(companyVat)}</companyVatCode>
  <client>
    <name>${escapeXml(giftCard.sender_name)}</name>
    <vatCode></vatCode>
    <isTaxPayer>false</isTaxPayer>
    <address>Gift Card Purchase</address>
    <city>Bucuresti</city>
    <country>Romania</country>
    <email>${escapeXml(giftCard.sender_email)}</email>
  </client>
  <issueDate>${issueDate}</issueDate>
  <seriesName>STRP</seriesName>
  <dueDate>${dueDate}</dueDate>
  <product>
    <name>${escapeXml(`Gift Card - ${giftCard.code} (PAID)`)}</name>
    <isDiscount>false</isDiscount>
    <measuringUnitName>buc</measuringUnitName>
    <currency>RON</currency>
    <quantity>1</quantity>
    <price>${finalAmount.toFixed(2)}</price>
    <isTaxIncluded>true</isTaxIncluded>
    <taxName>Normala</taxName>
    <taxPercentage>19</taxPercentage>
    <saveToDb>false</saveToDb>
    <isService>true</isService>
  </product>
  <observations>${escapeXml(`Gift Card ${giftCard.code} pentru ${giftCard.recipient_name}. Cumparat si platit de: ${giftCard.sender_name}. Plata finalizata.`)}</observations>
</estimate>`

    console.log('📄 Creating SmartBill proforma receipt for paid gift card')

    const apiUrl = `${baseUrl}/SBORO/api/estimate`
    const proformaResponse = await rateLimitedFetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${token}`)}`,
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
      },
      body: proformaXml
    })
    
    const responseText = await proformaResponse.text()
    
    if (!proformaResponse.ok) {
      console.error('❌ SmartBill API Error:', responseText)
      throw new Error(`SmartBill API error: ${responseText}`)
    }

    // Parse XML response
    const numberMatch = responseText.match(/<number>(.*?)<\/number>/)
    const seriesMatch = responseText.match(/<series>(.*?)<\/series>/)
    
    const documentNumber = numberMatch?.[1] || null
    const documentSeries = seriesMatch?.[1] || 'STRP'
    
    console.log('📄 SmartBill proforma receipt created:', {
      number: documentNumber,
      series: documentSeries
    })

    // Update gift card with proforma details
    const { error: updateError } = await supabaseClient
      .from('gift_cards')
      .update({
        smartbill_proforma_id: documentNumber ? `${documentSeries}${documentNumber}` : null,
        smartbill_proforma_status: 'completed'
      })
      .eq('id', giftCardId)

    if (updateError) {
      console.error('Error updating gift card with proforma details:', updateError)
    }

    console.log('✅ Post-payment proforma created successfully')

    return new Response(
      JSON.stringify({
        success: true,
        proformaId: documentNumber ? `${documentSeries}${documentNumber}` : null,
        message: 'Proforma receipt created successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating post-payment proforma:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to create proforma receipt' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
