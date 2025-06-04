
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
    console.log('🟠 Revolut Create Payment: Starting process');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { orderData, returnUrl } = await req.json();
    
    console.log('🟠 Revolut: Received order data:', JSON.stringify(orderData, null, 2));
    console.log('🟠 Revolut: Return URL:', returnUrl);

    const revolutApiKey = Deno.env.get('REVOLUT_API_KEY');
    if (!revolutApiKey) {
      console.error('❌ Revolut: API key not configured');
      throw new Error('Revolut API key not configured');
    }

    console.log('✅ Revolut: API key found, proceeding...');

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
      console.error('❌ Revolut: Error creating order in database:', orderError);
      throw new Error(`Database error: ${orderError.message}`);
    }

    console.log('✅ Revolut: Order created in database:', order.id);

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

    console.log('🟠 Revolut: Creating order with data:', JSON.stringify(revolutOrderData, null, 2));

    const revolutResponse = await fetch(revolutUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${revolutApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(revolutOrderData),
    });

    const responseText = await revolutResponse.text();
    console.log('🟠 Revolut API Response Status:', revolutResponse.status);
    console.log('🟠 Revolut API Response Text:', responseText);

    if (!revolutResponse.ok) {
      console.error('❌ Revolut API Error:', responseText);
      throw new Error(`Revolut API error (${revolutResponse.status}): ${responseText}`);
    }

    const revolutOrder = JSON.parse(responseText);
    console.log('✅ Revolut: Order created successfully:', {
      id: revolutOrder.id,
      checkout_url: revolutOrder.checkout_url ? 'Present' : 'Missing',
      state: revolutOrder.state
    });

    if (!revolutOrder.checkout_url) {
      console.error('❌ Revolut: No checkout URL in order response');
      throw new Error('Revolut did not return a checkout URL');
    }

    // Update order with Revolut order ID
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        revolut_order_id: revolutOrder.id,
        payment_url: revolutOrder.checkout_url,
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('⚠️ Revolut: Error updating order with details:', updateError);
      // Don't throw here as the payment order was created successfully
    } else {
      console.log('✅ Revolut: Order updated with order details');
    }

    const successResponse = {
      success: true,
      orderId: order.id,
      paymentUrl: revolutOrder.checkout_url,
      revolutOrderId: revolutOrder.id,
      provider: 'revolut'
    };

    console.log('🟠 Revolut: Returning success response:', successResponse);

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
    console.error('💥 Revolut: Fatal error:', error);
    
    const errorResponse = {
      success: false,
      error: error.message || 'Unknown error occurred',
      provider: 'revolut'
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
