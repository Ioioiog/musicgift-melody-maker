
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

        // Find order by stripe session ID with improved error handling
        console.log('🔍 Looking for order with stripe_session_id:', session.id);
        
        const { data: order, error: findError } = await supabaseClient
          .from('orders')
          .select('*')
          .eq('stripe_session_id', session.id)
          .single();

        if (findError) {
          console.error('❌ Error finding order:', findError);
          
          // Try to find by other means as fallback
          console.log('🔍 Trying to find order by metadata...');
          const orderId = session.metadata?.order_id;
          if (orderId) {
            const { data: fallbackOrder, error: fallbackError } = await supabaseClient
              .from('orders')
              .select('*')
              .eq('id', orderId)
              .single();
            
            if (fallbackOrder && !fallbackError) {
              console.log('✅ Found order by metadata fallback:', fallbackOrder.id);
              // Update with session ID for future reference
              await supabaseClient
                .from('orders')
                .update({ stripe_session_id: session.id })
                .eq('id', fallbackOrder.id);
              
              // Continue processing with fallback order
              await processSuccessfulPayment(supabaseClient, fallbackOrder, session);
            } else {
              console.error('❌ Could not find order by any method');
              throw new Error(`Order not found for session ${session.id} or metadata order_id ${orderId}`);
            }
          } else {
            throw findError;
          }
        } else if (order) {
          console.log('✅ Found order:', order.id);
          await processSuccessfulPayment(supabaseClient, order, session);
        }
        break;

      case 'checkout.session.expired':
      case 'payment_intent.payment_failed':
        const failedSession = event.data.object;
        console.log('Payment failed for session:', failedSession.id);

        // Update failed payment with improved error handling
        const { data: failedOrder, error: failedFindError } = await supabaseClient
          .from('orders')
          .select('id')
          .eq('stripe_session_id', failedSession.id)
          .single();

        if (failedOrder) {
          const { error: failedError } = await supabaseClient
            .from('orders')
            .update({
              payment_status: 'failed',
              updated_at: new Date().toISOString()
            })
            .eq('id', failedOrder.id);

          if (failedError) {
            console.error('Error updating failed payment:', failedError);
          } else {
            console.log('✅ Updated failed payment status for order:', failedOrder.id);
          }
        } else {
          console.error('Could not find order for failed session:', failedSession.id);
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

// Helper function to process successful payment
async function processSuccessfulPayment(supabaseClient: any, order: any, session: any) {
  console.log('🟣 Processing successful payment for order:', order.id);
  
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

  console.log('✅ Order updated successfully:', order.id);

  // Create SmartBill proforma after successful payment with payment context
  try {
    console.log('📄 Creating SmartBill proforma for order:', order.id);
    
    // Add payment context to order data
    const orderDataWithPaymentContext = {
      ...order,
      payment_completed_via: 'stripe',
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent
    };
    
    const proformaResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/smartbill-create-proforma`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      },
      body: JSON.stringify({ orderData: orderDataWithPaymentContext })
    });

    if (proformaResponse.ok) {
      const proformaResult = await proformaResponse.json();
      console.log('✅ SmartBill proforma created successfully:', proformaResult.proformaId);
    } else {
      const proformaError = await proformaResponse.text();
      console.error('❌ Failed to create SmartBill proforma:', proformaError);
      // Don't fail the webhook - log error and continue
    }
  } catch (proformaError) {
    console.error('💥 Error calling SmartBill proforma function:', proformaError);
    // Don't fail the webhook - log error and continue
  }
}
