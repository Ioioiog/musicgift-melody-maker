
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
    console.log('Processing direct Netopia payment for gift card:', giftCardId)

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
      paymentAmount = giftCard.amount_ron || (giftCard.gift_amount * 5); // 1 EUR = 5 RON
      paymentCurrency = 'RON';
    }

    // Convert from cents to currency units
    const finalAmount = paymentAmount / 100;

    console.log(`Processing direct Netopia payment for gift card ${giftCard.code}:`, {
      originalCurrency: giftCard.currency,
      originalAmount: giftCard.gift_amount,
      paymentCurrency,
      paymentAmount: finalAmount
    });

    // Prepare direct Netopia payment request (without SmartBill proforma)
    const paymentData = {
      config: {
        emailTemplate: ``,
        notifyUrl: `${Deno.env.get('SITE_URL')}/api/gift-card-payment-webhook`,
        redirectUrl: returnUrl || `${Deno.env.get('SITE_URL')}/gift`,
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
          amount: finalAmount,
          currency: paymentCurrency,
          orderDescription: `Gift Card - ${giftCard.code}`,
          products: [{
            name: 'Music Gift Card',
            code: giftCard.code,
            category: 'Gift Cards',
            price: finalAmount,
            vat: 19
          }]
        }
      }
    }

    console.log('Creating direct Netopia payment for gift card')

    // Make direct request to Netopia (bypassing SmartBill proforma)
    const netopiaResponse = await fetch('https://secure.mobilpay.ro/api/payment/v2/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': Deno.env.get('NETOPIA_API_KEY') || ''
      },
      body: JSON.stringify(paymentData)
    })

    const paymentResult = await netopiaResponse.json()

    if (!netopiaResponse.ok) {
      throw new Error(`Netopia payment error: ${paymentResult.message || 'Unknown error'}`)
    }

    // Update gift card with Netopia payment details (no SmartBill proforma yet)
    const { error: updateError } = await supabaseClient
      .from('gift_cards')
      .update({
        payment_status: 'pending',
        netopia_order_id: paymentResult.orderId || giftCard.id,
        payment_url: paymentResult.paymentUrl,
        payment_provider: 'netopia_direct'
      })
      .eq('id', giftCardId)

    if (updateError) {
      throw updateError
    }

    console.log('✅ Direct Netopia payment created successfully for gift card')

    return new Response(
      JSON.stringify({
        success: true,
        paymentUrl: paymentResult.paymentUrl,
        orderId: paymentResult.orderId || giftCard.id,
        paymentCurrency,
        paymentAmount: finalAmount
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Gift card Netopia payment error:', error)
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
