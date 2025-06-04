
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { orderData, returnUrl } = await req.json();
    
    console.log('Creating Stripe payment for order:', orderData);

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }

    // Create order in database first
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert([{
        ...orderData,
        payment_provider: 'stripe',
        status: 'pending',
        payment_status: 'pending'
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    console.log('Order created:', order.id);

    // Create Stripe checkout session
    const stripeUrl = 'https://api.stripe.com/v1/checkout/sessions';
    
    const lineItems = [{
      price_data: {
        currency: orderData.currency.toLowerCase(),
        product_data: {
          name: orderData.package_name || 'Custom Song Package',
          description: `Package: ${orderData.package_value}`,
        },
        unit_amount: orderData.total_price, // Amount in cents
      },
      quantity: 1,
    }];

    const sessionData = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${returnUrl.replace('success', 'cancel')}?order_id=${order.id}`,
      metadata: {
        order_id: order.id,
      },
    };

    const stripeResponse = await fetch(stripeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(sessionData as any).toString(),
    });

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      console.error('Stripe error:', session);
      throw new Error(`Stripe error: ${session.error?.message || 'Unknown error'}`);
    }

    console.log('Stripe session created:', session.id);

    // Update order with Stripe session ID
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        stripe_session_id: session.id,
        payment_url: session.url,
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error updating order with Stripe session:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        paymentUrl: session.url,
        sessionId: session.id,
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in stripe-create-payment:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
