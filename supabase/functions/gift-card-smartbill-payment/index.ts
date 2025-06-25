
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

    // Generate unique gift card code
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

    // SmartBill API configuration
    const smartbillConfig = {
      username: Deno.env.get('SMARTBILL_USERNAME'),
      token: Deno.env.get('SMARTBILL_TOKEN'),
      companyVat: Deno.env.get('SMARTBILL_COMPANY_VAT'),
      series: Deno.env.get('SMARTBILL_SERIES') || 'GC'
    };

    // Prepare SmartBill proforma data
    const proformaData = {
      companyVat: smartbillConfig.companyVat,
      client: {
        name: giftCardData.sender_name,
        email: giftCardData.sender_email,
        vatCode: "",
        regCom: "",
        address: "",
        isTaxPayer: false
      },
      issueDate: new Date().toISOString().split('T')[0],
      seriesName: smartbillConfig.series,
      currency: giftCardData.currency,
      products: [{
        name: `Gift Card - ${giftCardCode}`,
        code: giftCardCode,
        isDiscount: false,
        measuringUnit: "buc",
        currency: giftCardData.currency,
        quantity: 1,
        price: giftCardData.gift_amount,
        isTaxIncluded: true,
        taxName: "Taxă 0",
        taxPercentage: 0,
        isService: true
      }],
      language: "RO",
      observations: `Gift Card pentru ${giftCardData.recipient_name}. ${giftCardData.message_text || ''}`,
      mentions: ""
    };

    console.log('Creating SmartBill proforma for gift card:', giftCardCode)

    // Create SmartBill proforma
    const smartbillResponse = await fetch('https://ws.smartbill.ro/SBORO/api/estimate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${smartbillConfig.username}:${smartbillConfig.token}`)}`
      },
      body: JSON.stringify(proformaData)
    });

    const smartbillResult = await smartbillResponse.text();
    console.log('SmartBill response:', smartbillResult);

    let proformaInfo;
    try {
      proformaInfo = JSON.parse(smartbillResult);
    } catch (parseError) {
      console.error('Failed to parse SmartBill response:', parseError);
      throw new Error(`SmartBill API error: ${smartbillResult}`);
    }

    if (!smartbillResponse.ok || proformaInfo.errorText) {
      throw new Error(`SmartBill error: ${proformaInfo.errorText || smartbillResult}`);
    }

    console.log('SmartBill proforma created:', proformaInfo.number)

    // Create gift card record in database with real code and SmartBill details
    const giftCardRecord = {
      ...giftCardData,
      code: giftCardCode,
      smartbill_proforma_id: proformaInfo.number,
      smartbill_proforma_status: 'created',
      payment_status: 'pending',
      payment_provider: 'smartbill',
      payment_url: proformaInfo.url || `https://online.smartbill.ro/public/pay/${proformaInfo.number}`
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

    console.log('Gift card created successfully:', createdGiftCard.id)

    return new Response(
      JSON.stringify({
        success: true,
        url: proformaInfo.url || `https://online.smartbill.ro/public/pay/${proformaInfo.number}`,
        proformaId: proformaInfo.number,
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
