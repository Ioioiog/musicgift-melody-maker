
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
    
    console.log('Creating Revolut payment for order:', orderData);

    const revolutApiKey = Deno.env.get('REVOLUT_API_KEY');
    if (!revolutApiKey) {
      throw new Error('Revolut API key not configured');
    }

    // Create order in database first
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert([{
        ...orderData,
        payment_provider: 'revolut',
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

    // Create Revolut Business order
    const revolutUrl = 'https://b2b.revolut.com/api/1.0/orders';
    
    const revolutOrderData = {
      amount: orderData.total_price, // Amount in minor units (cents)
      currency: orderData.currency,
      merchant_order_ext_ref: order.id,
      description: `${orderData.package_name || 'Custom Song Package'} - ${orderData.package_value}`,
      customer_email: orderData.form_data?.email,
      settlement_currency: orderData.currency,
      redirect_urls: {
        success: `${returnUrl}?revolut_order_id={ORDER_ID}&order_id=${order.id}`,
        failure: `${returnUrl.replace('success', 'cancel')}?order_id=${order.id}`,
        cancel: `${returnUrl.replace('success', 'cancel')}?order_id=${order.id}`,
      }
    };

    const revolutResponse = await fetch(revolutUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${revolutApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(revolutOrderData),
    });

    const revolutOrder = await revolutResponse.json();

    if (!revolutResponse.ok) {
      console.error('Revolut error:', revolutOrder);
      throw new Error(`Revolut error: ${revolutOrder.message || 'Unknown error'}`);
    }

    console.log('Revolut order created:', revolutOrder.id);

    // Update order with Revolut order ID
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        revolut_order_id: revolutOrder.id,
        payment_url: revolutOrder.checkout_url,
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error updating order with Revolut order:', updateError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        paymentUrl: revolutOrder.checkout_url,
        revolutOrderId: revolutOrder.id,
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in revolut-create-payment:', error);
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
