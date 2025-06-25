
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

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
    console.log('Processing Stripe payment for gift card data:', giftCardData)

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16'
    })

    // Convert amount to cents for Stripe
    const amountInCents = giftCardData.gift_amount * 100

    console.log(`Creating Stripe session for gift card:`, {
      amount: amountInCents,
      currency: giftCardData.currency.toLowerCase()
    })

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

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: giftCardData.currency.toLowerCase(),
          product_data: {
            name: `Gift Card - ${giftCardCode}`,
            description: `Music Gift Card for ${giftCardData.recipient_name}`,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: returnUrl || `${Deno.env.get('SITE_URL')}/gift?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get('SITE_URL')}/gift?payment=cancel`,
      metadata: {
        gift_card_code: giftCardCode,
        type: 'gift_card'
      }
    })

    console.log('Stripe session created successfully:', session.id)

    // Create gift card record in database with pending status
    const giftCardRecord = {
      ...giftCardData,
      code: giftCardCode,
      stripe_session_id: session.id,
      payment_status: 'pending',
      payment_provider: 'stripe',
      payment_url: session.url
    };

    const { data: createdGiftCard, error: giftCardError } = await supabaseClient
      .from('gift_cards')
      .insert([giftCardRecord])
      .select()
      .single()

    if (giftCardError) {
      console.error('Error creating gift card:', giftCardError)
      // Cancel the Stripe session if gift card creation fails
      try {
        await stripe.checkout.sessions.expire(session.id);
      } catch (expireError) {
        console.error('Error expiring Stripe session:', expireError);
      }
      throw giftCardError
    }

    console.log('Gift card created successfully with pending status:', createdGiftCard.id)

    return new Response(
      JSON.stringify({
        success: true,
        url: session.url,
        sessionId: session.id,
        giftCardId: createdGiftCard.id,
        giftCardCode: giftCardCode
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
