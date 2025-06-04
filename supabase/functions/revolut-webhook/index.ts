
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
    console.log('Received Revolut webhook:', body);

    const { event, data } = body;

    switch (event) {
      case 'ORDER_COMPLETED':
        console.log('Revolut payment completed for order:', data.merchant_order_ext_ref);

        // Find order by revolut order ID
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
          // Update order status
          const { error: updateError } = await supabaseClient
            .from('orders')
            .update({
              payment_status: 'completed',
              status: 'processing',
              revolut_payment_id: data.id,
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

      case 'ORDER_CANCELLED':
      case 'ORDER_FAILED':
        console.log('Revolut payment failed/cancelled for order:', data.merchant_order_ext_ref);

        // Update failed payment
        const { error: failedError } = await supabaseClient
          .from('orders')
          .update({
            payment_status: event === 'ORDER_CANCELLED' ? 'cancelled' : 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('revolut_order_id', data.id);

        if (failedError) {
          console.error('Error updating failed payment:', failedError);
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
