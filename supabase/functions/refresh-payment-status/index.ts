
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { orderId } = await req.json()
    console.log('🔄 Refreshing payment status for order:', orderId)

    // Get order details
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      throw new Error(`Order not found: ${orderError?.message}`)
    }

    let statusChanged = false
    let message = 'Payment status checked'
    let newPaymentStatus = order.payment_status
    let newSmartBillStatus = order.smartbill_payment_status

    // Check Stripe payment status
    if (order.stripe_session_id && order.payment_provider === 'stripe') {
      try {
        console.log('🔍 Checking Stripe payment status...')
        const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
        
        if (stripeSecretKey) {
          const stripeResponse = await fetch(`https://api.stripe.com/v1/checkout/sessions/${order.stripe_session_id}`, {
            headers: {
              'Authorization': `Bearer ${stripeSecretKey}`,
            },
          })

          if (stripeResponse.ok) {
            const session = await stripeResponse.json()
            console.log('💳 Stripe session status:', session.payment_status)
            
            if (session.payment_status === 'paid' && order.payment_status !== 'completed') {
              newPaymentStatus = 'completed'
              statusChanged = true
              message = 'Stripe payment status updated to completed'
            } else if (session.payment_status === 'unpaid' && order.payment_status === 'completed') {
              newPaymentStatus = 'pending'
              statusChanged = true
              message = 'Stripe payment status updated to pending'
            }
          }
        }
      } catch (error) {
        console.error('❌ Error checking Stripe status:', error)
      }
    }

    // Check SmartBill status if available
    if (order.smartbill_proforma_id || order.smartbill_invoice_id) {
      try {
        console.log('🔍 Checking SmartBill payment status...')
        const { data: syncResult, error: syncError } = await supabaseClient.functions.invoke('smartbill-status-sync', {
          body: { orderId }
        })

        if (!syncError && syncResult?.statusChanged) {
          statusChanged = true
          newSmartBillStatus = syncResult.newStatus
          message = `SmartBill status updated: ${syncResult.message}`
        }
      } catch (error) {
        console.error('❌ Error checking SmartBill status:', error)
      }
    }

    // Update order with new statuses and timestamp
    const updateData: any = {
      last_status_check_at: new Date().toISOString()
    }

    if (statusChanged) {
      if (newPaymentStatus !== order.payment_status) {
        updateData.payment_status = newPaymentStatus
      }
      if (newSmartBillStatus !== order.smartbill_payment_status) {
        updateData.smartbill_payment_status = newSmartBillStatus
      }
    }

    const { error: updateError } = await supabaseClient
      .from('orders')
      .update(updateData)
      .eq('id', orderId)

    if (updateError) {
      console.error('❌ Error updating order:', updateError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        statusChanged,
        message,
        orderId,
        newPaymentStatus,
        newSmartBillStatus
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('💥 Error refreshing payment status:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to refresh payment status'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
