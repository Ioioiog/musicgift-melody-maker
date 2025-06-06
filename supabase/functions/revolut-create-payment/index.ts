
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
    
    // Use service role key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
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

    // Create order in database first - ensure payment_provider is set to 'revolut'
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

    // Create Revolut Business payment link
    const revolutUrl = 'https://b2b.revolut.com/api/1.0/payment-links';
    
    // Ensure amount is properly handled - convert to minor units if needed
    const paymentAmount = typeof orderData.total_price === 'number'
      ? Math.round(orderData.total_price)
      : 0;

    const revolutOrderData = {
      amount: paymentAmount,
      currency: orderData.currency || 'EUR',
      description: `${orderData.package_name || 'Custom Song Package'} - ${orderData.package_value}`,
      capture_mode: 'AUTOMATIC',
      merchant_order_ext_ref: order.id,
      customer_email: orderData.form_data?.email,
      callback_url: `${returnUrl}?revolut_payment_link_id={PAYMENT_LINK_ID}&order_id=${order.id}`
    };

    console.log('🟠 Revolut: Creating payment link with data:', JSON.stringify(revolutOrderData, null, 2));

    const revolutResponse = await fetch(revolutUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${revolutApiKey}`,
        'Content-Type': 'application/json',
        'Revolut-Api-Version': '2024-09-01',
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

    const revolutResult = JSON.parse(responseText);
    console.log('✅ Revolut: Payment link created successfully:', {
      id: revolutResult.id,
      link: revolutResult.link ? 'Present' : 'Missing',
      state: revolutResult.state
    });

    const paymentUrl = revolutResult.link;
    if (!paymentUrl) {
      console.error('❌ Revolut: No payment link in response');
      throw new Error('Revolut did not return a payment link');
    }

    // Update order with Revolut payment link ID and URL
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        revolut_order_id: revolutResult.id,
        payment_url: paymentUrl,
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('⚠️ Revolut: Error updating order with payment link details:', updateError);
      // Don't throw here as the payment link was created successfully
    } else {
      console.log('✅ Revolut: Order updated with payment link details');
    }

    const successResponse = {
      success: true,
      orderId: order.id,
      paymentUrl,
      revolutOrderId: revolutResult.id,
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
