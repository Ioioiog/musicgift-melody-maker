
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
    console.log('🟣 Stripe Create Payment: Starting process');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { orderData, returnUrl } = await req.json();
    
    console.log('🟣 Stripe: Received order data:', JSON.stringify(orderData, null, 2));
    console.log('🟣 Stripe: Return URL:', returnUrl);

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('❌ Stripe: Secret key not configured');
      throw new Error('Stripe secret key not configured');
    }

    console.log('✅ Stripe: Secret key found, proceeding...');

    // Create order in database first - ensure payment_provider is set to 'stripe'
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert([{
        ...orderData,
        payment_provider: 'stripe', // Explicitly set to stripe
        status: 'pending',
        payment_status: 'pending'
      }])
      .select()
      .single();

    if (orderError) {
      console.error('❌ Stripe: Error creating order in database:', orderError);
      throw new Error(`Database error: ${orderError.message}`);
    }

    console.log('✅ Stripe: Order created in database:', order.id);

    // Create Stripe checkout session
    const stripeUrl = 'https://api.stripe.com/v1/checkout/sessions';
    
    const sessionParams = new URLSearchParams({
      'payment_method_types[0]': 'card',
      'line_items[0][price_data][currency]': orderData.currency.toLowerCase(),
      'line_items[0][price_data][product_data][name]': orderData.package_name || 'Custom Song Package',
      'line_items[0][price_data][product_data][description]': `Package: ${orderData.package_value}`,
      'line_items[0][price_data][unit_amount]': orderData.total_price.toString(),
      'line_items[0][quantity]': '1',
      'mode': 'payment',
      'success_url': `${returnUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      'cancel_url': `${returnUrl.replace('success', 'cancel')}?order_id=${order.id}`,
      'metadata[order_id]': order.id,
    });

    console.log('🟣 Stripe: Creating checkout session with params:', sessionParams.toString());

    const stripeResponse = await fetch(stripeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: sessionParams.toString(),
    });

    const responseText = await stripeResponse.text();
    console.log('🟣 Stripe API Response Status:', stripeResponse.status);
    console.log('🟣 Stripe API Response Text:', responseText);

    if (!stripeResponse.ok) {
      console.error('❌ Stripe API Error:', responseText);
      throw new Error(`Stripe API error (${stripeResponse.status}): ${responseText}`);
    }

    const session = JSON.parse(responseText);
    console.log('✅ Stripe: Session created successfully:', {
      id: session.id,
      url: session.url ? 'Present' : 'Missing',
      status: session.status
    });

    if (!session.url) {
      console.error('❌ Stripe: No checkout URL in session response');
      throw new Error('Stripe did not return a checkout URL');
    }

    // Update order with Stripe session ID
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        stripe_session_id: session.id,
        payment_url: session.url,
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('⚠️ Stripe: Error updating order with session details:', updateError);
      // Don't throw here as the payment session was created successfully
    } else {
      console.log('✅ Stripe: Order updated with session details');
    }

    const successResponse = {
      success: true,
      orderId: order.id,
      paymentUrl: session.url,
      sessionId: session.id,
      provider: 'stripe'
    };

    console.log('🟣 Stripe: Returning success response:', successResponse);

    return new Response(
      JSON.stringify(successResponse),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('💥 Stripe: Fatal error:', error);
    
    const errorResponse = {
      success: false,
      error: error.message || 'Unknown error occurred',
      provider: 'stripe'
    };

    return new Response(
      JSON.stringify(errorResponse),
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
