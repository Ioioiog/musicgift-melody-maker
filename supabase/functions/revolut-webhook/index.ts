
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const body = await req.json();
    console.log('Received Revolut webhook:', JSON.stringify(body, null, 2));

    const { event, data } = body;

    switch (event) {
      case 'PAYMENT_LINK_PAID':
        console.log('Revolut payment link paid for order:', data.merchant_order_ext_ref);

        // Find order by revolut payment link ID
        const { data: order, error: findError } = await supabaseClient
          .from('orders')
          .select('*')
          .eq('revolut_order_id', data.id)
          .single();

        if (findError) {
          console.error('Error finding order:', findError);
          throw findError;
        }

        if (order) {
          // Update order status to completed
          const { error: updateError } = await supabaseClient
            .from('orders')
            .update({
              payment_status: 'completed',
              status: 'processing',
              revolut_payment_id: data.payment_id || data.id,
              updated_at: new Date().toISOString()
            })
            .eq('id', order.id);

          if (updateError) {
            console.error('Error updating order:', updateError);
            throw updateError;
          }

          console.log('Order updated successfully:', order.id);
        }
        break;

      case 'PAYMENT_LINK_FAILED':
      case 'PAYMENT_LINK_CANCELLED':
        console.log('Revolut payment link failed/cancelled for order:', data.merchant_order_ext_ref);

        // Update failed payment
        const { error: failedError } = await supabaseClient
          .from('orders')
          .update({
            payment_status: event === 'PAYMENT_LINK_CANCELLED' ? 'cancelled' : 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('revolut_order_id', data.id);

        if (failedError) {
          console.error('Error updating failed payment:', failedError);
        }
        break;

      case 'PAYMENT_LINK_EXPIRED':
        console.log('Revolut payment link expired for order:', data.merchant_order_ext_ref);

        // Update expired payment
        const { error: expiredError } = await supabaseClient
          .from('orders')
          .update({
            payment_status: 'expired',
            updated_at: new Date().toISOString()
          })
          .eq('revolut_order_id', data.id);

        if (expiredError) {
          console.error('Error updating expired payment:', expiredError);
        }
        break;

      default:
        console.log(`Unhandled Revolut event: ${event}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in revolut-webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
