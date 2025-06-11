
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

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
    console.log('Processing Stripe payment for gift card:', giftCardId)

    // Get gift card details
    const { data: giftCard, error: giftError } = await supabaseClient
      .from('gift_cards')
      .select('*')
      .eq('id', giftCardId)
      .single()

    if (giftError || !giftCard) {
      throw new Error('Gift card not found')
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16'
    })

    // Convert amount to cents for Stripe
    const amountInCents = giftCard.gift_amount * 100

    console.log(`Creating Stripe session for gift card ${giftCard.code}:`, {
      amount: amountInCents,
      currency: giftCard.currency.toLowerCase()
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: giftCard.currency.toLowerCase(),
          product_data: {
            name: `Gift Card - ${giftCard.code}`,
            description: `Music Gift Card for ${giftCard.recipient_name}`,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: returnUrl || `${Deno.env.get('SITE_URL')}/gift?payment=success`,
      cancel_url: `${Deno.env.get('SITE_URL')}/gift?payment=cancel`,
      metadata: {
        gift_card_id: giftCardId,
        type: 'gift_card'
      }
    })

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

    return new Response(
      JSON.stringify({
        success: true,
        url: session.url,
        sessionId: session.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Gift card Stripe payment error:', error)
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
