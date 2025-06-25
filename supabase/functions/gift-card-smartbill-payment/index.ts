
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Function to generate gift card code
function generateGiftCardCode(): string {
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ23456789'; // Excluded O, 0, 1, I for clarity
  let code = 'MG-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
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
    // Use service role key for database operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { giftCardData, returnUrl } = await req.json()
    console.log('Processing SmartBill payment for gift card data:', giftCardData)

    // Generate unique gift card code first
    let giftCardCode = generateGiftCardCode();
    
    // Ensure code is unique
    let codeExists = true;
    while (codeExists) {
      const { data: existingCard } = await supabaseClient
        .from('gift_cards')
        .select('id')
        .eq('code', giftCardCode)
        .single();
      
      if (!existingCard) {
        codeExists = false;
      } else {
        giftCardCode = generateGiftCardCode();
      }
    }

    console.log('Generated unique gift card code:', giftCardCode)

    // Validate SmartBill configuration
    const smartbillConfig = {
      username: Deno.env.get('SMARTBILL_USERNAME'),
      token: Deno.env.get('SMARTBILL_TOKEN'),
      companyVat: Deno.env.get('SMARTBILL_COMPANY_VAT'),
      series: 'GC' // Gift Card series
    };

    console.log('SmartBill config check:', {
      hasUsername: !!smartbillConfig.username,
      hasToken: !!smartbillConfig.token,
      hasCompanyVat: !!smartbillConfig.companyVat,
      series: smartbillConfig.series
    });

    // Validate required SmartBill credentials
    if (!smartbillConfig.username || !smartbillConfig.token || !smartbillConfig.companyVat) {
      throw new Error('Missing SmartBill credentials. Please check SMARTBILL_USERNAME, SMARTBILL_TOKEN, and SMARTBILL_COMPANY_VAT environment variables.');
    }

    // Calculate dates
    const issueDate = new Date().toISOString().split('T')[0]
    const dueDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] // 7 days from now

    // Prepare SmartBill proforma XML data
    const proformaXml = `<?xml version="1.0" encoding="UTF-8"?>
<estimate>
  <companyVatCode>${escapeXml(smartbillConfig.companyVat)}</companyVatCode>
  <client>
    <name>${escapeXml(giftCardData.sender_name)}</name>
    <vatCode></vatCode>
    <isTaxPayer>false</isTaxPayer>
    <address>Gift Card Purchase</address>
    <city>Bucuresti</city>
    <country>Romania</country>
    <email>${escapeXml(giftCardData.sender_email)}</email>
  </client>
  <issueDate>${issueDate}</issueDate>
  <seriesName>${smartbillConfig.series}</seriesName>
  <dueDate>${dueDate}</dueDate>
  <product>
    <name>${escapeXml(`Gift Card - ${giftCardCode}`)}</name>
    <isDiscount>false</isDiscount>
    <measuringUnitName>buc</measuringUnitName>
    <currency>${giftCardData.currency}</currency>
    <quantity>1</quantity>
    <price>${giftCardData.gift_amount.toFixed(2)}</price>
    <isTaxIncluded>true</isTaxIncluded>
    <taxName>Taxă 0</taxName>
    <taxPercentage>0</taxPercentage>
    <saveToDb>false</saveToDb>
    <isService>true</isService>
  </product>
  <observations>${escapeXml(`Gift Card ${giftCardCode} pentru ${giftCardData.recipient_name}. ${giftCardData.message_text || ''}`)}</observations>
</estimate>`

    console.log('Creating SmartBill proforma for gift card:', {
      code: giftCardCode,
      amount: giftCardData.gift_amount,
      currency: giftCardData.currency,
      companyVat: smartbillConfig.companyVat
    });

    // Create SmartBill proforma with XML format
    let smartbillResponse;
    try {
      smartbillResponse = await fetch('https://ws.smartbill.ro/SBORO/api/estimate', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${smartbillConfig.username}:${smartbillConfig.token}`)}`,
          'Content-Type': 'application/xml',
          'Accept': 'application/xml'
        },
        body: proformaXml
      });
    } catch (fetchError) {
      console.error('SmartBill API request failed:', fetchError);
      throw new Error(`SmartBill API connection failed: ${fetchError.message}`);
    }

    console.log('SmartBill response status:', smartbillResponse.status);

    const responseText = await smartbillResponse.text();
    console.log('SmartBill response (first 500 chars):', responseText.substring(0, 500));

    if (!smartbillResponse.ok) {
      console.error('SmartBill API error:', responseText);
      throw new Error(`SmartBill API error: ${responseText}`);
    }

    // Parse XML response
    const urlMatch = responseText.match(/<url>(.*?)<\/url>/);
    const numberMatch = responseText.match(/<number>(.*?)<\/number>/);
    const seriesMatch = responseText.match(/<series>(.*?)<\/series>/);
    
    const proformaNumber = numberMatch?.[1];
    const proformaSeries = seriesMatch?.[1] || smartbillConfig.series;
    const paymentUrl = urlMatch?.[1];

    if (!proformaNumber) {
      console.error('SmartBill response missing proforma number:', responseText);
      throw new Error('SmartBill API did not return a proforma number');
    }

    console.log('SmartBill proforma created successfully:', {
      number: proformaNumber,
      series: proformaSeries,
      url: paymentUrl
    });

    // Create gift card record in database with pending status
    const giftCardRecord = {
      ...giftCardData,
      code: giftCardCode,
      smartbill_proforma_id: `${proformaSeries}${proformaNumber}`,
      smartbill_proforma_status: 'created',
      payment_status: 'pending',
      payment_provider: 'smartbill',
      payment_url: paymentUrl || `https://online.smartbill.ro/public/pay/${proformaNumber}`
    };

    const { data: createdGiftCard, error: giftCardError } = await supabaseClient
      .from('gift_cards')
      .insert([giftCardRecord])
      .select()
      .single()

    if (giftCardError) {
      console.error('Error creating gift card:', giftCardError)
      throw giftCardError
    }

    console.log('Gift card created successfully with pending status:', createdGiftCard.id)

    return new Response(
      JSON.stringify({
        success: true,
        url: paymentUrl || `https://online.smartbill.ro/public/pay/${proformaNumber}`,
        proformaId: `${proformaSeries}${proformaNumber}`,
        giftCardId: createdGiftCard.id,
        giftCardCode: giftCardCode
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
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
