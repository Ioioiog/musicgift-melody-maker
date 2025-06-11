
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔔 Netopia Webhook - Processing payment notification...');

    // Parse the webhook payload
    const payload = await req.json();
    console.log('📦 Netopia webhook payload:', JSON.stringify(payload, null, 2));

    // Extract payment information from Netopia payload
    const {
      ntpID,           // Netopia transaction ID
      status,          // Payment status
      amount,          // Payment amount
      currency,        // Payment currency
      orderId,         // Merchant order ID (should match our order ID)
      signature,       // Security signature
      timestamp        // Payment timestamp
    } = payload;

    console.log('💳 Payment details:', {
      ntpID,
      status,
      amount,
      currency,
      orderId,
      timestamp
    });

    // Validate required fields
    if (!ntpID || !status || !orderId) {
      console.error('❌ Invalid Netopia payload - missing required fields');
      return new Response(
        JSON.stringify({ error: 'Invalid payload - missing required fields' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Determine payment status
    let paymentStatus = 'pending';
    let orderStatus = 'pending';
    let smartbillStatus = 'pending';

    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'success':
      case 'paid':
      case 'approved':
        paymentStatus = 'completed';
        orderStatus = 'completed';
        smartbillStatus = 'confirmed';
        break;
      
      case 'failed':
      case 'error':
      case 'declined':
      case 'rejected':
        paymentStatus = 'failed';
        orderStatus = 'cancelled';
        smartbillStatus = 'failed';
        break;
      
      case 'cancelled':
      case 'canceled':
      case 'voided':
        paymentStatus = 'cancelled';
        orderStatus = 'cancelled';
        smartbillStatus = 'cancelled';
        break;
      
      default:
        paymentStatus = 'pending';
        orderStatus = 'pending';
        smartbillStatus = 'pending';
    }

    console.log(`📊 Status mapping: ${status} -> payment: ${paymentStatus}, order: ${orderStatus}, smartbill: ${smartbillStatus}`);

    // Find the order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('❌ Order not found:', orderId, orderError);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    console.log('📋 Found order:', {
      id: order.id,
      current_payment_status: order.payment_status,
      current_smartbill_status: order.smartbill_payment_status,
      proforma_id: order.smartbill_proforma_id
    });

    // Only update if status has changed
    const statusChanged = order.payment_status !== paymentStatus || 
                         order.smartbill_payment_status !== smartbillStatus ||
                         order.status !== orderStatus;

    if (statusChanged) {
      const updateData = {
        payment_status: paymentStatus,
        smartbill_payment_status: smartbillStatus,
        status: orderStatus,
        webhook_processed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('🔄 Updating order status:', updateData);

      const { error: updateError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (updateError) {
        console.error('❌ Error updating order:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update order status' }),
          { status: 500, headers: corsHeaders }
        );
      }

      console.log(`✅ Order ${orderId} status updated successfully via Netopia webhook`);

      // If payment was successful and we have a proforma, we might want to trigger invoice conversion
      if (paymentStatus === 'completed' && order.smartbill_proforma_id && !order.smartbill_invoice_id) {
        console.log('💡 Payment confirmed for proforma - consider triggering invoice conversion');
        
        // Optional: Auto-trigger invoice conversion
        try {
          const { data: conversionData, error: conversionError } = await supabase.functions.invoke('convert-to-invoice', {
            body: { 
              orderId: orderId,
              conversionSource: 'netopia_webhook_auto'
            }
          });

          if (conversionError) {
            console.error('⚠️ Auto invoice conversion failed:', conversionError);
          } else if (conversionData?.success) {
            console.log('🧾 Auto invoice conversion successful:', conversionData.invoiceId);
          }
        } catch (conversionError) {
          console.error('⚠️ Auto invoice conversion error:', conversionError);
        }
      }
    } else {
      console.log('ℹ️ No status change needed - order already has correct status');
    }

    // Log the webhook event for debugging
    console.log('📝 Webhook processed successfully:', {
      ntpID,
      orderId,
      status: paymentStatus,
      statusChanged,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        ntpID,
        status: paymentStatus,
        statusChanged,
        message: statusChanged ? 'Order status updated successfully' : 'No status change needed'
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('💥 Error in Netopia webhook:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
