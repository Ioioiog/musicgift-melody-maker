
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

    // Get gift card details
    const { data: giftCard, error: giftError } = await supabaseClient
      .from('gift_cards')
      .select('*')
      .eq('id', giftCardId)
      .single()

    if (giftError || !giftCard) {
      throw new Error('Gift card not found')
    }

    // Prepare Netopia payment request
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
          amount: (giftCard.gift_amount || 0) / 100, // Convert from cents
          currency: 'RON',
          orderDescription: `Gift Card - ${giftCard.code}`,
          products: [{
            name: 'Music Gift Card',
            code: giftCard.code,
            category: 'Gift Cards',
            price: (giftCard.gift_amount || 0) / 100,
            vat: 19
          }]
        }
      }
    }

    // Make request to Netopia
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
      throw new Error(`Payment gateway error: ${paymentResult.message || 'Unknown error'}`)
    }

    // Update gift card with payment details
    const { error: updateError } = await supabaseClient
      .from('gift_cards')
      .update({
        payment_id: paymentResult.orderId,
        payment_url: paymentResult.paymentUrl,
        payment_status: 'pending'
      })
      .eq('id', giftCardId)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({
        success: true,
        paymentUrl: paymentResult.paymentUrl,
        orderId: paymentResult.orderId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Gift card payment error:', error)
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
