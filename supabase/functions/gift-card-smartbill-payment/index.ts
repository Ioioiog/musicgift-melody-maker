
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

const validateSmartBillConfig = () => {
  const username = Deno.env.get('SMARTBILL_USERNAME')
  const token = Deno.env.get('SMARTBILL_TOKEN')
  const baseUrl = Deno.env.get('SMARTBILL_BASE_URL') || 'https://ws.smartbill.ro'
  const companyVat = Deno.env.get('SMARTBILL_COMPANY_VAT')
  
  console.log('SmartBill Config Check:', {
    username: username ? `${username.substring(0, 3)}***` : 'MISSING',
    token: token ? `***${token.length} chars***` : 'MISSING',
    baseUrl,
    companyVat: companyVat ? `${companyVat.substring(0, 4)}***` : 'MISSING'
  })
  
  return { username, token, baseUrl, companyVat }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { giftCardId, returnUrl } = await req.json()
    console.log('Processing SmartBill payment for gift card:', giftCardId)

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

    // Use the stored amount in the selected currency
    let paymentAmount = giftCard.gift_amount || 0;
    let paymentCurrency = giftCard.currency || 'RON';
    
    // For EUR payments, convert to RON for Netopia
    if (giftCard.currency === 'EUR') {
      // Use the stored RON amount if available, otherwise use a conversion
      paymentAmount = giftCard.amount_ron || (giftCard.gift_amount * 500); // 1 EUR = 5 RON
      paymentCurrency = 'RON';
    }

    console.log(`Processing SmartBill payment for gift card ${giftCard.code}:`, {
      originalCurrency: giftCard.currency,
      originalAmount: giftCard.gift_amount,
      paymentCurrency,
      paymentAmount
    });

    // Validate SmartBill configuration
    const { username, token, baseUrl, companyVat } = validateSmartBillConfig()

    if (!username || !token || !companyVat) {
      console.error('❌ SmartBill configuration incomplete')
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'SmartBill payment system not configured properly' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    // Calculate dates
    const issueDate = new Date().toISOString().split('T')[0]
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Prepare client data for gift card
    const clientName = giftCard.sender_name || 'Gift Card Sender'
    const clientEmail = giftCard.sender_email || ''
    const clientAddress = 'Gift Card Purchase'
    const clientCity = 'Bucuresti'

    console.log('👤 Gift card client data prepared:', {
      name: clientName,
      email: clientEmail,
      address: clientAddress,
      city: clientCity
    })

    // Format price with two decimal places for SmartBill/Netopia compatibility
    const formattedPrice = paymentAmount.toFixed(2)

    console.log('💰 Final price formatting for SmartBill XML:', {
      originalAmount: giftCard.gift_amount,
      paymentAmount: paymentAmount,
      formattedPrice: formattedPrice,
      currency: paymentCurrency
    })
    
    // Create proforma with payment link using STRP series - following order pattern
    const proformaXml = `<?xml version="1.0" encoding="UTF-8"?>
<estimate>
  <companyVatCode>${escapeXml(companyVat)}</companyVatCode>
  <client>
    <name>${escapeXml(clientName)}</name>
    <vatCode></vatCode>
    <isTaxPayer>false</isTaxPayer>
    <address>${escapeXml(clientAddress)}</address>
    <city>${escapeXml(clientCity)}</city>
    <country>Romania</country>
    <email>${escapeXml(clientEmail)}</email>
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
    <price>${formattedPrice}</price>
    <isTaxIncluded>true</isTaxIncluded>
    <taxName>Normala</taxName>
    <taxPercentage>19</taxPercentage>
    <saveToDb>false</saveToDb>
    <isService>true</isService>
  </product>
  <observations>${escapeXml(`Gift Card ${giftCard.code} pentru ${giftCard.recipient_name}. Cumparat de: ${giftCard.sender_name}`)}</observations>
</estimate>`

    console.log('📄 Creating SmartBill proforma for gift card with STRP series')

    // Create proforma via SmartBill API using XML format
    let proformaResponse: Response
    let responseText: string
    
    try {
      const apiUrl = `${baseUrl}/SBORO/api/estimate`
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
      
      return new Response(
        JSON.stringify({
          success: false,
          error: `Network error contacting SmartBill: ${fetchError.message}`
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // Check if SmartBill returned an error
    if (!proformaResponse.ok) {
      console.error('❌ SmartBill API Error Response:', {
        status: proformaResponse.status,
        statusText: proformaResponse.statusText,
        body: responseText
      })
      
      return new Response(
        JSON.stringify({
          success: false,
          error: `SmartBill API error (${proformaResponse.status}): ${responseText}`
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // Parse XML response to extract payment URL and document number
    const urlMatch = responseText.match(/<url>(.*?)<\/url>/)
    const numberMatch = responseText.match(/<number>(.*?)<\/number>/)
    const seriesMatch = responseText.match(/<series>(.*?)<\/series>/)
    
    const smartBillPaymentUrl = urlMatch?.[1] || null
    const documentNumber = numberMatch?.[1] || null
    const documentSeries = seriesMatch?.[1] || 'STRP'
    
    console.log('📄 SmartBill document details extracted:', {
      number: documentNumber,
      series: documentSeries,
      paymentUrl: smartBillPaymentUrl ? 'URL Generated' : 'NO URL'
    })
    
    // Check if we got a valid payment URL
    if (!smartBillPaymentUrl) {
      console.error('❌ SmartBill did not return a payment URL')
      console.error('📄 Full response for debugging:', responseText)
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'SmartBill document created but no payment URL generated - Netopia integration may not be configured'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    console.log('✅ SmartBill proforma created successfully for gift card')

    // Update gift card with SmartBill details
    const { error: updateError } = await supabaseClient
      .from('gift_cards')
      .update({
        payment_status: 'pending'
      })
      .eq('id', giftCardId)

    if (updateError) {
      console.error('Error updating gift card:', updateError)
      throw updateError
    }

    console.log('🎉 SmartBill integration completed successfully for gift card')

    return new Response(
      JSON.stringify({
        success: true,
        paymentUrl: smartBillPaymentUrl,
        orderId: documentNumber ? `${documentSeries}${documentNumber}` : null,
        paymentCurrency,
        paymentAmount
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
