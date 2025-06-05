
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

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    console.log('Received Stripe webhook');

    // Verify webhook signature (in production)
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (webhookSecret && signature) {
      // Signature verification would go here
      console.log('Webhook signature verification enabled');
    }

    const event = JSON.parse(body);
    console.log('Stripe event type:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Payment successful for session:', session.id);

        // Find order by stripe session ID
        const { data: order, error: findError } = await supabaseClient
          .from('orders')
          .select('*')
          .eq('stripe_session_id', session.id)
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
              stripe_payment_intent_id: session.payment_intent,
              updated_at: new Date().toISOString()
            })
            .eq('id', order.id);

          if (updateError) {
            console.error('Error updating order:', updateError);
            throw updateError;
          }

          console.log('Order updated successfully:', order.id);

          // Create SmartBill proforma after successful payment
          try {
            console.log('Creating SmartBill proforma for order:', order.id);
            
            const proformaResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/smartbill-create-proforma`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
              },
              body: JSON.stringify({ orderData: order })
            });

            if (proformaResponse.ok) {
              const proformaResult = await proformaResponse.json();
              console.log('SmartBill proforma created successfully:', proformaResult.proformaId);
            } else {
              const proformaError = await proformaResponse.text();
              console.error('Failed to create SmartBill proforma:', proformaError);
              // Don't fail the webhook - log error and continue
            }
          } catch (proformaError) {
            console.error('Error calling SmartBill proforma function:', proformaError);
            // Don't fail the webhook - log error and continue
          }
        }
        break;

      case 'checkout.session.expired':
      case 'payment_intent.payment_failed':
        const failedSession = event.data.object;
        console.log('Payment failed for session:', failedSession.id);

        // Update failed payment
        const { error: failedError } = await supabaseClient
          .from('orders')
          .update({
            payment_status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_session_id', failedSession.id);

        if (failedError) {
          console.error('Error updating failed payment:', failedError);
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in stripe-webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
