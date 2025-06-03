
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SmartBillWebhookPayload {
  invoiceId?: string;
  paymentStatus?: string;
  amount?: number;
  currency?: string;
  transactionId?: string;
  paymentDate?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const webhookData: SmartBillWebhookPayload = await req.json()
    console.log('SmartBill webhook received:', webhookData)

    const { invoiceId, paymentStatus, amount, currency, transactionId, paymentDate } = webhookData

    if (!invoiceId) {
      throw new Error('Invoice ID is required')
    }

    // Find the order by SmartBill invoice ID
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('smartbill_invoice_id', invoiceId)
      .single()

    if (orderError) {
      throw new Error(`Order not found: ${orderError.message}`)
    }

    console.log('Found order for webhook:', order.id)

    // Map SmartBill payment status to our order status
    let newPaymentStatus = 'pending'
    let newOrderStatus = order.status

    switch (paymentStatus?.toLowerCase()) {
      case 'paid':
      case 'completed':
      case 'success':
        newPaymentStatus = 'completed'
        newOrderStatus = 'confirmed'
        break
      case 'failed':
      case 'error':
        newPaymentStatus = 'failed'
        newOrderStatus = 'cancelled'
        break
      case 'cancelled':
      case 'canceled':
        newPaymentStatus = 'cancelled'
        newOrderStatus = 'cancelled'
        break
      default:
        newPaymentStatus = 'pending'
    }

    // Update order with payment information
    const updateData: any = {
      payment_status: newPaymentStatus,
      status: newOrderStatus,
      smartbill_payment_status: paymentStatus,
      updated_at: new Date().toISOString()
    }

    // Add transaction details if available
    if (transactionId) {
      updateData.payment_id = transactionId
    }

    const { error: updateError } = await supabaseClient
      .from('orders')
      .update(updateData)
      .eq('id', order.id)

    if (updateError) {
      throw new Error(`Failed to update order: ${updateError.message}`)
    }

    console.log(`Order ${order.id} updated successfully. Status: ${newOrderStatus}, Payment: ${newPaymentStatus}`)

    // TODO: Send confirmation email if payment is successful
    if (newPaymentStatus === 'completed') {
      console.log('Payment completed - should send confirmation email')
      // Implement email sending logic here
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: order.id,
        message: 'Webhook processed successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error processing SmartBill webhook:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process webhook'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
