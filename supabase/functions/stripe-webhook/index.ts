import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Custom async signature verification for Deno
async function verifyStripeSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    console.log('🔐 Starting async signature verification...');
    
    // Parse the signature header
    const elements = signature.split(',');
    let timestamp: string | null = null;
    let v1Signature: string | null = null;

    for (const element of elements) {
      const [key, value] = element.split('=');
      if (key === 't') {
        timestamp = value;
      } else if (key === 'v1') {
        v1Signature = value;
      }
    }

    if (!timestamp || !v1Signature) {
      console.error('❌ Invalid signature format - missing timestamp or v1 signature');
      return false;
    }

    // Check timestamp tolerance (5 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    const webhookTime = parseInt(timestamp);
    const tolerance = 300; // 5 minutes in seconds

    if (Math.abs(currentTime - webhookTime) > tolerance) {
      console.error('❌ Signature timestamp outside tolerance window');
      return false;
    }

    // Create the signed payload
    const signedPayload = `${timestamp}.${payload}`;
    
    // Import the secret key for HMAC
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Compute the expected signature
    const signature_bytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload));
    const expectedSignature = Array.from(new Uint8Array(signature_bytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Timing-safe comparison
    const providedSignature = v1Signature.toLowerCase();
    
    if (expectedSignature.length !== providedSignature.length) {
      console.error('❌ Signature length mismatch');
      return false;
    }

    let result = 0;
    for (let i = 0; i < expectedSignature.length; i++) {
      result |= expectedSignature.charCodeAt(i) ^ providedSignature.charCodeAt(i);
    }

    const isValid = result === 0;
    console.log(`${isValid ? '✅' : '❌'} Signature verification ${isValid ? 'successful' : 'failed'}`);
    
    return isValid;
  } catch (error) {
    console.error('❌ Error during signature verification:', error);
    return false;
  }
}

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
    
    console.log('🔔 Received Stripe webhook');

    let event;
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    // Async signature verification for Deno compatibility
    if (webhookSecret && signature) {
      try {
        console.log('🔐 Using async signature verification for Deno compatibility');
        const isValidSignature = await verifyStripeSignature(body, signature, webhookSecret);
        
        if (!isValidSignature) {
          console.error('❌ Webhook signature verification failed');
          return new Response(
            JSON.stringify({ error: 'Invalid signature' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        console.log('✅ Webhook signature verified successfully with async method');
        event = JSON.parse(body);
      } catch (signatureError) {
        console.error('❌ Webhook signature verification failed:', signatureError);
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    } else {
      console.log('⚠️ Webhook signature verification disabled (no secret configured)');
      event = JSON.parse(body);
    }

    // Check for duplicate webhook events
    const { data: existingEvent } = await supabaseClient
      .from('stripe_webhook_events')
      .select('id, processing_status')
      .eq('event_id', event.id)
      .single();

    if (existingEvent) {
      console.log('🔄 Duplicate webhook event detected:', event.id, 'Status:', existingEvent.processing_status);
      
      if (existingEvent.processing_status === 'completed') {
        console.log('✅ Event already processed successfully, skipping');
        return new Response(JSON.stringify({ received: true, duplicate: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      console.log('⚠️ Event exists but not completed, reprocessing...');
    }

    // Log webhook event for audit trail
    const { data: webhookEvent, error: logError } = await supabaseClient
      .from('stripe_webhook_events')
      .upsert({
        event_id: event.id,
        event_type: event.type,
        payload: event,
        processing_status: 'processing',
        processed_at: new Date().toISOString()
      }, {
        onConflict: 'event_id'
      })
      .select()
      .single();

    if (logError) {
      console.error('⚠️ Failed to log webhook event:', logError);
    }

    try {
      await processStripeEvent(supabaseClient, event, webhookEvent?.id);
      
      // Mark event as completed
      if (webhookEvent) {
        await supabaseClient
          .from('stripe_webhook_events')
          .update({ 
            processing_status: 'completed',
            processed_at: new Date().toISOString()
          })
          .eq('id', webhookEvent.id);
      }
      
      console.log('✅ Webhook event processed successfully');
      
    } catch (processingError) {
      console.error('❌ Error processing webhook event:', processingError);
      
      // Mark event as failed
      if (webhookEvent) {
        await supabaseClient
          .from('stripe_webhook_events')
          .update({ 
            processing_status: 'failed',
            error_message: processingError.message,
            processed_at: new Date().toISOString()
          })
          .eq('id', webhookEvent.id);
      }
      
      throw processingError;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Error in stripe-webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Process Stripe events with enhanced error handling and idempotency
async function processStripeEvent(supabaseClient: any, event: any, webhookEventId?: string) {
  console.log('🎯 Processing Stripe event type:', event.type);

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(supabaseClient, event, webhookEventId);
      break;

    case 'checkout.session.expired':
      await handleCheckoutSessionExpired(supabaseClient, event);
      break;

    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(supabaseClient, event);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(supabaseClient, event);
      break;

    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(supabaseClient, event);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(supabaseClient, event);
      break;

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }
}

// Handle successful checkout session completion
async function handleCheckoutSessionCompleted(supabaseClient: any, event: any, webhookEventId?: string) {
  const session = event.data.object;
  console.log('💳 Payment successful for session:', session.id);

  // Check if this is a gift card payment
  if (session.metadata?.type === 'gift_card') {
    await handleGiftCardPayment(supabaseClient, session, webhookEventId);
    return;
  }

  // Handle regular order payments
  await handleOrderPayment(supabaseClient, session, webhookEventId);
}

// Handle gift card payment completion
async function handleGiftCardPayment(supabaseClient: any, session: any, webhookEventId?: string) {
  const giftCardId = session.metadata?.gift_card_id;
  
  if (!giftCardId) {
    console.error('❌ No gift card ID found in session metadata');
    return;
  }

  console.log('🎁 Processing gift card payment for:', giftCardId);

  // Find gift card
  const { data: giftCard, error: findError } = await supabaseClient
    .from('gift_cards')
    .select('*')
    .eq('id', giftCardId)
    .single();

  if (findError || !giftCard) {
    console.error('❌ Gift card not found:', giftCardId);
    throw new Error(`Gift card not found: ${giftCardId}`);
  }

  // Check if already processed
  if (giftCard.payment_status === 'completed') {
    console.log('⚠️ Gift card payment already processed:', giftCardId);
    return;
  }

  // Update gift card payment status
  const { error: updateError } = await supabaseClient
    .from('gift_cards')
    .update({
      payment_status: 'completed',
      stripe_session_id: session.id,
      stripe_customer_id: session.customer,
      updated_at: new Date().toISOString()
    })
    .eq('id', giftCardId);

  if (updateError) {
    console.error('❌ Error updating gift card:', updateError);
    throw updateError;
  }

  console.log('✅ Gift card payment updated successfully:', giftCardId);

  // Create SmartBill proforma for gift card
  try {
    console.log('📄 Creating SmartBill proforma for gift card:', giftCardId);
    
    const proformaResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/create-gift-card-proforma`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      },
      body: JSON.stringify({ giftCardId })
    });

    const proformaResponseText = await proformaResponse.text();
    console.log('📄 SmartBill proforma response:', proformaResponseText);

    if (proformaResponse.ok) {
      try {
        const proformaResult = JSON.parse(proformaResponseText);
        if (proformaResult.success) {
          console.log('✅ SmartBill proforma created successfully for gift card:', proformaResult.proformaId);
        } else {
          console.error('❌ SmartBill proforma creation failed for gift card:', proformaResult.error);
        }
      } catch (parseError) {
        console.error('❌ Failed to parse SmartBill response for gift card:', parseError);
      }
    } else {
      console.error('❌ SmartBill proforma request failed for gift card:', proformaResponse.status, proformaResponseText);
      
      // Update gift card with proforma failure status
      await supabaseClient
        .from('gift_cards')
        .update({
          smartbill_proforma_status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', giftCardId);
    }
  } catch (proformaError) {
    console.error('💥 Error calling SmartBill proforma function for gift card:', proformaError);
    
    // Update gift card with proforma failure status
    await supabaseClient
      .from('gift_cards')
      .update({
        smartbill_proforma_status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', giftCardId);
  }
}

// Handle regular order payment completion
async function handleOrderPayment(supabaseClient: any, session: any, webhookEventId?: string) {
  // Find order by stripe session ID with improved error handling
  console.log('🔍 Looking for order with stripe_session_id:', session.id);
  
  const { data: order, error: findError } = await supabaseClient
    .from('orders')
    .select('*')
    .eq('stripe_session_id', session.id)
    .single();

  if (findError) {
    console.error('❌ Error finding order:', findError);
    
    // Try to find by metadata as fallback
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
          .update({ 
            stripe_session_id: session.id,
            stripe_customer_id: session.customer 
          })
          .eq('id', fallbackOrder.id);
        
        await processSuccessfulPayment(supabaseClient, fallbackOrder, session, webhookEventId);
        return;
      }
    }
    
    console.error('❌ Could not find order by any method');
    throw new Error(`Order not found for session ${session.id}`);
  }

  if (!order) {
    throw new Error(`Order not found for session ${session.id}`);
  }

  console.log('✅ Found order:', order.id);
  
  // Check if order was already processed to prevent duplicate proforma creation
  if (order.webhook_processed_at) {
    console.log('⚠️ Order already processed at:', order.webhook_processed_at);
    
    // Check if proforma/invoice already exists
    if (order.smartbill_proforma_id || order.smartbill_invoice_id) {
      console.log('✅ Order already has proforma/invoice, skipping duplicate processing');
      return;
    }
  }

  await processSuccessfulPayment(supabaseClient, order, session, webhookEventId);
}

// Handle checkout session expiration
async function handleCheckoutSessionExpired(supabaseClient: any, event: any) {
  const session = event.data.object;
  console.log('⏰ Checkout session expired:', session.id);

  // Handle gift card expiration
  if (session.metadata?.type === 'gift_card') {
    const giftCardId = session.metadata?.gift_card_id;
    if (giftCardId) {
      await supabaseClient
        .from('gift_cards')
        .update({
          payment_status: 'expired',
          updated_at: new Date().toISOString()
        })
        .eq('id', giftCardId);
      console.log('✅ Updated expired session for gift card:', giftCardId);
    }
    return;
  }

  // Handle order expiration
  const { data: order } = await supabaseClient
    .from('orders')
    .select('id')
    .eq('stripe_session_id', session.id)
    .single();

  if (order) {
    await supabaseClient
      .from('orders')
      .update({
        payment_status: 'expired',
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    console.log('✅ Updated expired session for order:', order.id);
  }
}

// Handle payment intent success (additional confirmation)
async function handlePaymentIntentSucceeded(supabaseClient: any, event: any) {
  const paymentIntent = event.data.object;
  console.log('💰 Payment intent succeeded:', paymentIntent.id);

  // Find order by payment intent ID
  const { data: order } = await supabaseClient
    .from('orders')
    .select('*')
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .single();

  if (order && order.payment_status !== 'completed') {
    await supabaseClient
      .from('orders')
      .update({
        payment_status: 'completed',
        stripe_customer_id: paymentIntent.customer,
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    console.log('✅ Confirmed payment completion for order:', order.id);
  }
}

// Handle payment intent failure
async function handlePaymentIntentFailed(supabaseClient: any, event: any) {
  const paymentIntent = event.data.object;
  console.log('❌ Payment intent failed:', paymentIntent.id);

  // Find order by payment intent ID or customer
  let order = null;
  
  // Try to find by payment intent ID first
  const { data: orderByIntent } = await supabaseClient
    .from('orders')
    .select('*')
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .single();

  if (orderByIntent) {
    order = orderByIntent;
  } else if (paymentIntent.customer) {
    // Try to find by customer ID and recent timestamp
    const { data: orderByCustomer } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('stripe_customer_id', paymentIntent.customer)
      .eq('payment_status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (orderByCustomer) {
      order = orderByCustomer;
    }
  }

  if (order) {
    const failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';
    
    await supabaseClient
      .from('orders')
      .update({
        payment_status: 'failed',
        status: 'failed',
        smartbill_proforma_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    console.log('✅ Updated failed payment for order:', order.id, 'Reason:', failureReason);
  } else {
    console.log('⚠️ Could not find order for failed payment intent:', paymentIntent.id);
  }
}

// Handle invoice payment success (for subscriptions)
async function handleInvoicePaymentSucceeded(supabaseClient: any, event: any) {
  const invoice = event.data.object;
  console.log('📄 Invoice payment succeeded:', invoice.id);
  
  // This would be useful for subscription-based orders in the future
  console.log('ℹ️ Invoice payment handling not implemented yet');
}

// Handle subscription deletion
async function handleSubscriptionDeleted(supabaseClient: any, event: any) {
  const subscription = event.data.object;
  console.log('🗑️ Subscription deleted:', subscription.id);
  
  // This would be useful for subscription-based orders in the future
  console.log('ℹ️ Subscription deletion handling not implemented yet');
}

// Helper function to process successful payment with enhanced idempotency
async function processSuccessfulPayment(supabaseClient: any, order: any, session: any, webhookEventId?: string) {
  console.log('🟢 Processing successful payment for order:', order.id);
  
  // Double-check idempotency before creating proforma
  if (order.smartbill_proforma_id || order.smartbill_invoice_id) {
    console.log('⚠️ Order already has proforma/invoice:', {
      proforma_id: order.smartbill_proforma_id,
      invoice_id: order.smartbill_invoice_id
    });
    console.log('✅ Skipping duplicate proforma creation');
    return;
  }

  // Update order status with webhook processing timestamp
  const { error: updateError } = await supabaseClient
    .from('orders')
    .update({
      payment_status: 'completed',
      status: 'processing',
      stripe_payment_intent_id: session.payment_intent,
      stripe_customer_id: session.customer || order.stripe_customer_id,
      webhook_processed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', order.id);

  if (updateError) {
    console.error('❌ Error updating order:', updateError);
    throw updateError;
  }

  console.log('✅ Order updated successfully:', order.id);

  // Link webhook event to order
  if (webhookEventId) {
    await supabaseClient
      .from('stripe_webhook_events')
      .update({ order_id: order.id })
      .eq('id', webhookEventId);
  }

  // Create SmartBill proforma after successful payment with enhanced error handling
  try {
    console.log('📄 Creating SmartBill proforma for order:', order.id);
    
    // Add payment context to order data
    const orderDataWithPaymentContext = {
      ...order,
      payment_completed_via: 'stripe',
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent,
      stripe_customer_id: session.customer || order.stripe_customer_id
    };
    
    const proformaResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/smartbill-create-proforma`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      },
      body: JSON.stringify({ orderData: orderDataWithPaymentContext })
    });

    const proformaResponseText = await proformaResponse.text();
    console.log('📄 SmartBill proforma response status:', proformaResponse.status);
    console.log('📄 SmartBill proforma response:', proformaResponseText);

    if (proformaResponse.ok) {
      try {
        const proformaResult = JSON.parse(proformaResponseText);
        if (proformaResult.success) {
          console.log('✅ SmartBill proforma created successfully:', proformaResult.proformaId);
        } else {
          console.error('❌ SmartBill proforma creation failed:', proformaResult.error);
        }
      } catch (parseError) {
        console.error('❌ Failed to parse SmartBill response:', parseError);
      }
    } else {
      console.error('❌ SmartBill proforma request failed:', proformaResponse.status, proformaResponseText);
      
      // Update order with proforma failure status
      await supabaseClient
        .from('orders')
        .update({
          smartbill_proforma_status: 'failed',
          smartbill_proforma_error: proformaResponseText,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);
    }
  } catch (proformaError) {
    console.error('💥 Error calling SmartBill proforma function:', proformaError);
    
    // Update order with proforma failure status
    await supabaseClient
      .from('orders')
      .update({
        smartbill_proforma_status: 'failed',
        smartbill_proforma_error: proformaError.message,
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);
  }
}
