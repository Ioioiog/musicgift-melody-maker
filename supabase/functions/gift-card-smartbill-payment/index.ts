
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

    const { giftCardId, returnUrl } = await req.json()
    console.log('Processing SmartBill proforma payment for gift card:', giftCardId)

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

    // Validate SmartBill configuration
    const username = Deno.env.get('SMARTBILL_USERNAME')
    const token = Deno.env.get('SMARTBILL_TOKEN')
    const baseUrl = Deno.env.get('SMARTBILL_BASE_URL') || 'https://ws.smartbill.ro'
    const companyVat = Deno.env.get('SMARTBILL_COMPANY_VAT')

    if (!username || !token || !companyVat) {
      throw new Error('SmartBill configuration incomplete')
    }

    // Use the gift card amount directly (already in base currency, not cents)
    let paymentAmount = giftCard.gift_amount || 0;
    let paymentCurrency = giftCard.currency || 'RON';
    
    // For EUR payments, convert to RON for SmartBill
    if (giftCard.currency === 'EUR') {
      paymentAmount = giftCard.amount_ron || (giftCard.gift_amount * 5); // Use stored RON amount or convert
      paymentCurrency = 'RON';
    }

    // No need to divide by 100 - gift card amounts are already in base currency
    const finalAmount = paymentAmount;

    console.log(`Creating SmartBill proforma for gift card ${giftCard.code}:`, {
      originalCurrency: giftCard.currency,
      originalAmount: giftCard.gift_amount,
      paymentCurrency,
      paymentAmount: finalAmount
    });

    // Calculate dates
    const issueDate = new Date().toISOString().split('T')[0]
    const dueDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] // 7 days from now

    // Create SmartBill proforma XML for gift card - matching the working orders function structure
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
  <paymentUrl>Generate URL</paymentUrl>
  <product>
    <name>${escapeXml(`Gift Card - ${giftCard.code}`)}</name>
    <isDiscount>false</isDiscount>
    <measuringUnitName>buc</measuringUnitName>
    <currency>${paymentCurrency}</currency>
    <quantity>1</quantity>
    <price>${finalAmount.toFixed(2)}</price>
    <isTaxIncluded>true</isTaxIncluded>
    <taxName>Normala</taxName>
    <taxPercentage>19</taxPercentage>
    <saveToDb>false</saveToDb>
    <isService>true</isService>
  </product>
  <observations>${escapeXml(`Gift Card ${giftCard.code} pentru ${giftCard.recipient_name}. Cumparat de: ${giftCard.sender_name}`)}</observations>
</estimate>`

    console.log('📄 Creating SmartBill proforma for gift card with STRP series')
    console.log('🔗 XML payload prepared for SmartBill API with payment URL generation')

    const apiUrl = `${baseUrl}/SBORO/api/estimate`
    
    let proformaResponse: Response
    let responseText: string
    
    try {
      console.log('🌐 Sending request to SmartBill API:', apiUrl)
      
      proformaResponse = await rateLimitedFetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${username}:${token}`)}`,
          'Content-Type': 'application/xml',
          'Accept': 'application/xml'
        },
        body: proformaXml
      })
      
      responseText = await proformaResponse.text()
      console.log('📥 SmartBill API Response Status:', proformaResponse.status)
      console.log('📥 SmartBill API Response:', responseText.substring(0, 500) + '...')
      
    } catch (fetchError) {
      console.error('🌐 Network Error calling SmartBill API:', fetchError)
      throw new Error(`Network error contacting SmartBill: ${fetchError.message}`)
    }
    
    if (!proformaResponse.ok) {
      console.error('❌ SmartBill API Error:', {
        status: proformaResponse.status,
        statusText: proformaResponse.statusText,
        body: responseText
      })
      throw new Error(`SmartBill API error (${proformaResponse.status}): ${responseText}`)
    }

    // Parse XML response
    const urlMatch = responseText.match(/<url>(.*?)<\/url>/)
    const numberMatch = responseText.match(/<number>(.*?)<\/number>/)
    const seriesMatch = responseText.match(/<series>(.*?)<\/series>/)
    
    const paymentUrl = urlMatch?.[1] || null
    const documentNumber = numberMatch?.[1] || null
    const documentSeries = seriesMatch?.[1] || 'STRP'
    
    console.log('📄 SmartBill document details extracted:', {
      number: documentNumber,
      series: documentSeries,
      paymentUrl: paymentUrl ? 'URL Generated' : 'NO URL'
    })
    
    if (!paymentUrl) {
      console.error('❌ SmartBill did not return a payment URL')
      console.error('📄 Full response for debugging:', responseText)
      throw new Error('SmartBill document created but no payment URL generated - Netopia integration may not be configured')
    }

    console.log('✅ SmartBill proforma created successfully')

    // Update gift card with SmartBill details
    const { error: updateError } = await supabaseClient
      .from('gift_cards')
      .update({
        payment_status: 'pending',
        smartbill_proforma_id: documentNumber ? `${documentSeries}${documentNumber}` : null,
        smartbill_proforma_status: 'created',
        payment_url: paymentUrl,
        payment_provider: 'smartbill'
      })
      .eq('id', giftCardId)

    if (updateError) {
      console.error('Error updating gift card:', updateError)
      throw updateError
    }

    console.log('✅ SmartBill proforma created successfully for gift card')

    return new Response(
      JSON.stringify({
        success: true,
        paymentUrl: paymentUrl,
        orderId: giftCard.id,
        proformaId: documentNumber ? `${documentSeries}${documentNumber}` : null,
        paymentCurrency,
        paymentAmount: finalAmount
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Gift card SmartBill payment error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Payment processing failed. Please try again.' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
