
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

    console.log('🔍 Netopia Payment Status Checker - Starting...');

    const { orderId } = await req.json();
    console.log('📋 Checking payment status for order:', orderId);

    // Get order details
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

    console.log('📋 Order details:', {
      id: order.id,
      payment_status: order.payment_status,
      smartbill_payment_url: order.smartbill_payment_url,
      smartbill_proforma_id: order.smartbill_proforma_id
    });

    // Check if order has a Netopia payment URL
    if (!order.smartbill_payment_url) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'No Netopia payment URL found for this order' 
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('🌐 Original payment URL:', order.smartbill_payment_url);

    // Extract payment ID from the payment URL
    let paymentId = '';
    let finalUrl = order.smartbill_payment_url;
    
    try {
      // If it's an l.mpy.ro URL, we need to follow the redirect to get the full URL
      if (order.smartbill_payment_url.includes('l.mpy.ro')) {
        console.log('🔄 Following redirect for short URL...');
        
        const redirectResponse = await fetch(order.smartbill_payment_url, {
          method: 'HEAD',
          redirect: 'follow'
        });
        
        finalUrl = redirectResponse.url;
        console.log('🎯 Final URL after redirect:', finalUrl);
      }

      // Extract payment ID from various URL formats
      console.log('🔍 Extracting payment ID from URL:', finalUrl);
      
      // Pattern 1: /qp/{payment_id} format (most common after redirect)
      const qpMatch = finalUrl.match(/\/qp\/([^\/\?&]+)/);
      if (qpMatch) {
        paymentId = qpMatch[1];
        console.log('✅ Extracted payment ID from /qp/ format:', paymentId);
      }
      
      // Pattern 2: reqId parameter or path
      if (!paymentId) {
        const reqIdMatch = finalUrl.match(/reqId[\/=]([^&\/\?]+)/);
        if (reqIdMatch) {
          paymentId = reqIdMatch[1];
          console.log('✅ Extracted payment ID from reqId format:', paymentId);
        }
      }
      
      // Pattern 3: Direct payment ID in URL path
      if (!paymentId) {
        const pathMatch = finalUrl.match(/\/([a-zA-Z0-9\-_]+)(?:\?|$)/);
        if (pathMatch && pathMatch[1] && pathMatch[1].length > 10) {
          paymentId = pathMatch[1];
          console.log('✅ Extracted payment ID from path format:', paymentId);
        }
      }

      if (!paymentId) {
        throw new Error('Could not extract payment ID from URL using any known pattern');
      }

      console.log('🔑 Final extracted payment ID:', paymentId);

    } catch (error) {
      console.error('❌ Error extracting payment ID:', error);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to extract payment ID from URL',
          details: error.message,
          url: finalUrl
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Build the status check URL using the payment ID
    const statusUrl = `https://secure.mobilpay.ro/qp/${paymentId}/status`;
    console.log('🔍 Checking status at URL:', statusUrl);

    // Fetch the status page
    let statusResponse;
    try {
      statusResponse = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!statusResponse.ok) {
        // Try alternative status URL format
        const altStatusUrl = `https://secure.mobilpay.ro/default/card2/status/reqId/${paymentId}`;
        console.log('🔄 Trying alternative status URL:', altStatusUrl);
        
        statusResponse = await fetch(altStatusUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        if (!statusResponse.ok) {
          throw new Error(`HTTP ${statusResponse.status}: ${statusResponse.statusText}`);
        }
      }

    } catch (error) {
      console.error('❌ Error fetching status page:', error);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to fetch payment status page',
          details: error.message
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Parse the HTML response
    const htmlContent = await statusResponse.text();
    console.log('📄 Status page HTML length:', htmlContent.length);

    // Analyze payment status from HTML content
    let paymentStatus = 'unknown';
    let paymentMessage = '';
    let statusChanged = false;

    // Check for payment completion indicators
    if (htmlContent.includes('Plata dumneavoastră a fost finalizată') || 
        htmlContent.includes('plată finalizată') ||
        htmlContent.includes('Mulțumim! Plata') ||
        htmlContent.includes('Payment completed') ||
        htmlContent.includes('Transaction successful')) {
      paymentStatus = 'completed';
      paymentMessage = 'Payment completed successfully';
      console.log('✅ Payment detected as COMPLETED');
    }
    // Check for pending/processing indicators
    else if (htmlContent.includes('În procesare') || 
             htmlContent.includes('procesare') ||
             htmlContent.includes('pending') ||
             htmlContent.includes('Processing')) {
      paymentStatus = 'pending';
      paymentMessage = 'Payment is still processing';
      console.log('⏳ Payment detected as PENDING');
    }
    // Check if payment form is still visible (not paid)
    else if (htmlContent.includes('form') && 
             (htmlContent.includes('card') || htmlContent.includes('plată'))) {
      paymentStatus = 'pending';
      paymentMessage = 'Payment form still active - not paid';
      console.log('❌ Payment detected as NOT PAID (form visible)');
    }
    // Check for failed payment indicators
    else if (htmlContent.includes('eșuată') || 
             htmlContent.includes('failed') ||
             htmlContent.includes('respins') ||
             htmlContent.includes('declined')) {
      paymentStatus = 'failed';
      paymentMessage = 'Payment failed';
      console.log('❌ Payment detected as FAILED');
    }
    else {
      paymentStatus = 'unknown';
      paymentMessage = 'Could not determine payment status from page content';
      console.log('❓ Payment status UNKNOWN - analyzing page content...');
      
      // Log a snippet of the content for debugging
      const snippet = htmlContent.substring(0, 500);
      console.log('📝 Page content snippet:', snippet);
    }

    // Update order status if payment is completed and current status is different
    if (paymentStatus === 'completed' && order.payment_status !== 'completed') {
      console.log('🔄 Updating order status to completed...');
      
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'completed',
          smartbill_payment_status: 'paid',
          status: 'completed',
          last_status_check_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('❌ Error updating order:', updateError);
      } else {
        statusChanged = true;
        console.log('✅ Order status updated successfully');
      }
    }
    // Update last check timestamp even if status hasn't changed
    else {
      await supabase
        .from('orders')
        .update({
          last_status_check_at: new Date().toISOString()
        })
        .eq('id', orderId);
    }

    console.log('📊 Final status check result:', {
      orderId,
      paymentId,
      paymentStatus,
      statusChanged,
      paymentMessage
    });

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        reqId: paymentId, // Keep this for backwards compatibility
        paymentId,
        paymentStatus,
        paymentMessage,
        statusChanged,
        statusUrl
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('💥 Error in Netopia payment status checker:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        details: error.message
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
