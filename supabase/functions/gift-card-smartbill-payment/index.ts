
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Check if NETOPIA_API_KEY is configured
    const netopiaApiKey = Deno.env.get('NETOPIA_API_KEY');
    if (!netopiaApiKey) {
      console.error('NETOPIA_API_KEY is not configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Payment configuration is incomplete. Please contact support.' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

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

    // Prepare Netopia payment request
    const paymentData = {
      config: {
        emailTemplate: ``,
        notifyUrl: `${Deno.env.get('SITE_URL')}/api/gift-card-payment-webhook`,
        redirectUrl: returnUrl || `${Deno.env.get('SITE_URL')}/gift?payment=success`,
        language: 'en'
      },
      payment: {
        options: {
          installments: 1,
          bonus: 0
        },
        instrument: {
          type: 'card',
          account: 'MG_DEMO',
          data: {
            billingDetails: {
              firstName: giftCard.sender_name.split(' ')[0] || '',
              lastName: giftCard.sender_name.split(' ').slice(1).join(' ') || '',
              email: giftCard.sender_email,
              phone: '',
              city: '',
              country: 'RO',
              state: '',
              postalCode: '',
              details: ''
            }
          }
        },
        data: {
          orderId: giftCard.id,
          amount: paymentAmount,
          currency: paymentCurrency,
          orderDescription: `Gift Card - ${giftCard.code}`,
          products: [{
            name: 'Music Gift Card',
            code: giftCard.code,
            category: 'Gift Cards',
            price: paymentAmount,
            vat: 19
          }]
        }
      }
    }

    console.log('Sending payment request to Netopia...');

    // Make request to Netopia
    const netopiaResponse = await fetch('https://secure.mobilpay.ro/api/payment/v2/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': netopiaApiKey
      },
      body: JSON.stringify(paymentData)
    })

    console.log('Netopia response status:', netopiaResponse.status);
    console.log('Netopia response headers:', Object.fromEntries(netopiaResponse.headers.entries()));
    
    // Get response text first to handle both JSON and HTML responses
    const responseText = await netopiaResponse.text();
    console.log('Netopia response text preview:', responseText.substring(0, 500));

    // Check if response is HTML (error page)
    if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
      console.error('Received HTML error page from Netopia');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Payment gateway configuration error. Please contact support.' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    let paymentResult;
    try {
      paymentResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Netopia response as JSON:', parseError);
      console.error('Response text:', responseText);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Payment gateway returned invalid response. Please try again or contact support.' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    if (!netopiaResponse.ok) {
      console.error('Netopia API error:', paymentResult);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Payment gateway error: ${paymentResult.message || 'Please try again or contact support'}` 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    // Update gift card with payment details
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

    console.log('Payment session created successfully:', paymentResult.paymentUrl || paymentResult.url);

    return new Response(
      JSON.stringify({
        success: true,
        paymentUrl: paymentResult.paymentUrl || paymentResult.url,
        orderId: paymentResult.orderId,
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
