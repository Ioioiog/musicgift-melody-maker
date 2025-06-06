// File: create-revolut-payment.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { orderData, returnUrl } = await req.json();
    const revolutApiKey = Deno.env.get('REVOLUT_API_KEY');

    if (!revolutApiKey) throw new Error('Revolut API key not configured');

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        payment_provider: 'revolut',
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw new Error(`Database error: ${orderError.message}`);

    const revolutUrl = 'https://b2b.revolut.com/api/1.0/payment-links';
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
      callback_url: `${returnUrl}?revolut_order_id={PAYMENT_LINK_ID}&order_id=${order.id}`
    };

    const revolutResponse = await fetch(revolutUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${revolutApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(revolutOrderData)
    });

    const responseText = await revolutResponse.text();
    if (!revolutResponse.ok) {
      throw new Error(`Revolut API error (${revolutResponse.status}): ${responseText}`);
    }

    const revolutResult = JSON.parse(responseText);
    const paymentUrl = revolutResult.link;

    if (!paymentUrl) throw new Error('Revolut did not return a payment link');

    await supabase
      .from('orders')
      .update({
        revolut_order_id: revolutResult.id,
        payment_url: paymentUrl
      })
      .eq('id', order.id);

    return new Response(JSON.stringify({
      success: true,
      orderId: order.id,
      paymentUrl,
      revolutOrderId: revolutResult.id,
      provider: 'revolut'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      provider: 'revolut'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
