import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const orderData = await req.json();
    console.log('Submitting order for payment via Stripe:', orderData);

    const { data: savedOrder, error: orderError } = await supabaseClient.from('orders').insert({
      form_data: orderData.form_data,
      selected_addons: orderData.selected_addons,
      total_price: orderData.total_price,
      status: 'pending',
      payment_status: 'pending',
      package_value: orderData.package_value,
      package_name: orderData.package_name,
      package_price: orderData.package_price,
      package_delivery_time: orderData.package_delivery_time,
      package_includes: orderData.package_includes,
      currency: orderData.currency,
      user_id: orderData.user_id,
      gift_card_id: orderData.gift_card_id,
      is_gift_redemption: orderData.is_gift_redemption,
      gift_credit_applied: orderData.gift_credit_applied,
      provider: 'stripe'
    }).select().single();

    if (orderError) throw new Error(`Failed to save order: ${orderError.message}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `https://www.musicgift.ro/payment/success?orderId=${savedOrder.id}`,
      cancel_url: `https://www.musicgift.ro/payment/cancelled?orderId=${savedOrder.id}`,
      customer_email: orderData.form_data.email,
      line_items: [
        {
          price_data: {
            currency: orderData.currency.toLowerCase(),
            product_data: {
              name: `${orderData.package_name} - Cadou muzical personalizat`,
              description: `Livrare: ${orderData.package_delivery_time}`
            },
            unit_amount: Math.round(orderData.total_price * 100)
          },
          quantity: 1
        }
      ],
      metadata: {
        order_id: savedOrder.id
      }
    });

    await supabaseClient.from('orders').update({
      stripe_session_id: session.id,
      payment_url: session.url
    }).eq('id', savedOrder.id);

    return new Response(
      JSON.stringify({ success: true, orderId: savedOrder.id, paymentUrl: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (err) {
    console.error('Order submission error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
