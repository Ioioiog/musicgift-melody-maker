
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const webhookData = await req.json()
    console.log('NETOPIA Webhook received:', webhookData)

    // Extract payment information from webhook
    const {
      ntpID: netopiaOrderId,
      orderID: orderId,
      amount,
      currency,
      status,
      paymentId,
      errorCode,
      errorMessage
    } = webhookData

    if (!netopiaOrderId && !orderId) {
      console.error('No order ID found in webhook data')
      return new Response('No order ID found', { status: 400 })
    }

    // Find the order by netopia_order_id or original order id
    let query = supabaseClient.from('orders').select('*')
    
    if (netopiaOrderId) {
      query = query.eq('netopia_order_id', netopiaOrderId)
    } else if (orderId) {
      query = query.eq('id', orderId)
    }

    const { data: orders, error: fetchError } = await query

    if (fetchError) {
      console.error('Error fetching order:', fetchError)
      return new Response('Error fetching order', { status: 500 })
    }

    if (!orders || orders.length === 0) {
      console.error('Order not found for webhook:', { netopiaOrderId, orderId })
      return new Response('Order not found', { status: 404 })
    }

    const order = orders[0]

    // Determine payment status based on NETOPIA response
    let paymentStatus = 'failed'
    
    if (status === 'confirmed' || status === 'paid' || status === 'success') {
      paymentStatus = 'completed'
    } else if (status === 'pending' || status === 'processing') {
      paymentStatus = 'pending'
    } else if (status === 'cancelled' || status === 'canceled') {
      paymentStatus = 'cancelled'
    } else if (status === 'failed' || status === 'error' || errorCode) {
      paymentStatus = 'failed'
    }

    // Update order with payment result
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        payment_status: paymentStatus,
        payment_id: paymentId || order.payment_id,
        status: paymentStatus === 'completed' ? 'paid' : order.status
      })
      .eq('id', order.id)

    if (updateError) {
      console.error('Error updating order payment status:', updateError)
      return new Response('Error updating order', { status: 500 })
    }

    console.log(`Order ${order.id} payment status updated to: ${paymentStatus}`)

    // TODO: Send confirmation email if payment is completed
    // TODO: Send notification to admin if needed

    return new Response('OK', { 
      headers: corsHeaders,
      status: 200 
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Webhook error', { status: 500 })
  }
})
