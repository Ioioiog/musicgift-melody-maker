
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

// Enhanced price conversion logic aligned with order implementation
function convertAmountForSmartBill(amount: number, currency: string): number {
  // Gift cards store amounts in base currency units (not cents like Stripe)
  // If amount is in EUR, convert to RON for SmartBill
  if (currency === 'EUR') {
    return amount * 5; // 1 EUR = 5 RON fixed rate
  }
  return amount;
}

// Enhanced client data preparation
function prepareClientData(giftCardData: any) {
  return {
    name: escapeXml(giftCardData.sender_name || 'Gift Card Purchaser'),
    vatCode: '', // Empty for individuals
    isTaxPayer: false, // Most gift card buyers are individuals
    address: escapeXml(giftCardData.sender_address || 'Gift Card Purchase'),
    city: escapeXml(giftCardData.sender_city || 'Bucuresti'),
    country: 'Romania',
    email: escapeXml(giftCardData.sender_email)
  };
}

// Enhanced SmartBill configuration validation
function validateSmartBillConfig() {
  const config = {
    username: Deno.env.get('SMARTBILL_USERNAME'),
    token: Deno.env.get('SMARTBILL_TOKEN'),
    companyVat: Deno.env.get('SMARTBILL_COMPANY_VAT'),
    baseUrl: Deno.env.get('SMARTBILL_BASE_URL') || 'https://ws.smartbill.ro',
    series: Deno.env.get('SMARTBILL_SERIES') || 'STRP'
  };

  console.log('SmartBill config validation:', {
    hasUsername: !!config.username,
    hasToken: !!config.token,
    hasCompanyVat: !!config.companyVat,
    baseUrl: config.baseUrl,
    series: config.series
  });

  if (!config.username || !config.token || !config.companyVat) {
    throw new Error('Missing SmartBill credentials. Please check SMARTBILL_USERNAME, SMARTBILL_TOKEN, and SMARTBILL_COMPANY_VAT environment variables.');
  }

  return config;
}

// Enhanced database update with proper error handling
async function updateGiftCardStatus(supabaseClient: any, giftCardId: string, updates: any) {
  try {
    const { error } = await supabaseClient
      .from('gift_cards')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', giftCardId);

    if (error) {
      console.error('Error updating gift card status:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to update gift card status:', error);
    // Don't throw here to avoid breaking the payment flow
  }
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

    // Validate SmartBill configuration first
    const smartbillConfig = validateSmartBillConfig();

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

    // Enhanced price conversion logic
    const originalAmount = giftCardData.gift_amount;
    const currency = giftCardData.currency || 'RON';
    const smartbillAmount = convertAmountForSmartBill(originalAmount, currency);
    
    console.log('Price conversion:', {
      original: originalAmount,
      currency: currency,
      smartbillAmount: smartbillAmount
    });

    // Calculate dates
    const issueDate = new Date().toISOString().split('T')[0]
    const dueDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] // 7 days from now

    // Prepare enhanced client data
    const clientData = prepareClientData(giftCardData);

    // Prepare SmartBill proforma XML data with enhanced structure and CRUCIAL paymentUrl field
    const proformaXml = `<?xml version="1.0" encoding="UTF-8"?>
<estimate>
  <companyVatCode>${escapeXml(smartbillConfig.companyVat)}</companyVatCode>
  <client>
    <name>${clientData.name}</name>
    <vatCode>${clientData.vatCode}</vatCode>
    <isTaxPayer>${clientData.isTaxPayer}</isTaxPayer>
    <address>${clientData.address}</address>
    <city>${clientData.city}</city>
    <country>${clientData.country}</country>
    <email>${clientData.email}</email>
  </client>
  <issueDate>${issueDate}</issueDate>
  <seriesName>${smartbillConfig.series}</seriesName>
  <dueDate>${dueDate}</dueDate>
  <paymentUrl>Generate URL</paymentUrl>
  <product>
    <name>${escapeXml(`Gift Card - ${giftCardCode}`)}</name>
    <isDiscount>false</isDiscount>
    <measuringUnitName>buc</measuringUnitName>
    <currency>RON</currency>
    <quantity>1</quantity>
    <price>${smartbillAmount.toFixed(2)}</price>
    <isTaxIncluded>true</isTaxIncluded>
    <taxName>Normala</taxName>
    <taxPercentage>19</taxPercentage>
    <saveToDb>false</saveToDb>
    <isService>true</isService>
  </product>
  <observations>${escapeXml(`Gift Card ${giftCardCode} pentru ${giftCardData.recipient_name}. ${giftCardData.message_text || ''}`)}</observations>
</estimate>`

    console.log('Creating SmartBill proforma for gift card:', {
      code: giftCardCode,
      originalAmount: originalAmount,
      smartbillAmount: smartbillAmount,
      currency: currency,
      companyVat: smartbillConfig.companyVat,
      series: smartbillConfig.series
    });

    // Create SmartBill proforma with enhanced error handling
    let smartbillResponse;
    try {
      const apiUrl = `${smartbillConfig.baseUrl}/SBORO/api/estimate`;
      smartbillResponse = await fetch(apiUrl, {
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
      throw new Error(`SmartBill API error (${smartbillResponse.status}): ${responseText}`);
    }

    // Enhanced XML response parsing
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

    if (!paymentUrl) {
      console.error('SmartBill response missing payment URL:', responseText);
      throw new Error('SmartBill did not generate a payment URL. Please check if Netopia payment gateway is configured in your SmartBill account.');
    }

    const proformaId = `${proformaSeries}${proformaNumber}`;

    console.log('SmartBill proforma created successfully:', {
      number: proformaNumber,
      series: proformaSeries,
      proformaId: proformaId,
      url: paymentUrl
    });

    // Create gift card record in database with enhanced data structure
    const giftCardRecord = {
      ...giftCardData,
      code: giftCardCode,
      smartbill_proforma_id: proformaId,
      smartbill_proforma_status: 'created',
      payment_status: 'pending',
      payment_provider: 'smartbill',
      payment_url: paymentUrl,
      amount_ron: currency === 'RON' ? originalAmount : smartbillAmount,
      amount_eur: currency === 'EUR' ? originalAmount : Math.round(originalAmount / 5)
    };

    const { data: createdGiftCard, error: giftCardError } = await supabaseClient
      .from('gift_cards')
      .insert([giftCardRecord])
      .select()
      .single()

    if (giftCardError) {
      console.error('Error creating gift card:', giftCardError)
      
      // Update SmartBill proforma status to indicate database error
      await updateGiftCardStatus(supabaseClient, 'temp', {
        smartbill_proforma_status: 'database_error',
        payment_status: 'failed'
      });
      
      throw giftCardError
    }

    console.log('Gift card created successfully with pending status:', createdGiftCard.id)

    return new Response(
      JSON.stringify({
        success: true,
        url: paymentUrl,
        proformaId: proformaId,
        giftCardId: createdGiftCard.id,
        giftCardCode: giftCardCode,
        paymentProvider: 'smartbill',
        currency: currency,
        originalAmount: originalAmount,
        smartbillAmount: smartbillAmount
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
        error: error.message,
        provider: 'smartbill'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
