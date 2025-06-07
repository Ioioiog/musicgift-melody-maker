
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

    const { orderIds = [] } = await req.json()
    console.log('🔄 Bulk refreshing payment status for orders:', orderIds.length || 'all pending')

    // Get orders to refresh
    let query = supabaseClient
      .from('orders')
      .select('id, payment_status, smartbill_payment_status, stripe_session_id, payment_provider, smartbill_proforma_id, smartbill_invoice_id')

    if (orderIds.length > 0) {
      query = query.in('id', orderIds)
    } else {
      // Only refresh orders that might need status updates (pending payments or recent orders)
      query = query.or('payment_status.eq.pending,smartbill_payment_status.eq.pending')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
    }

    const { data: orders, error: ordersError } = await query.limit(50) // Limit to prevent timeout

    if (ordersError) {
      throw new Error(`Failed to fetch orders: ${ordersError.message}`)
    }

    console.log(`📊 Found ${orders.length} orders to refresh`)

    let successCount = 0
    let errorCount = 0
    let changedCount = 0

    // Process orders in batches to avoid rate limiting
    const batchSize = 5
    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize)
      
      await Promise.all(batch.map(async (order) => {
        try {
          const { data, error } = await supabaseClient.functions.invoke('refresh-payment-status', {
            body: { orderId: order.id }
          })

          if (error) {
            console.error(`❌ Error refreshing order ${order.id}:`, error)
            errorCount++
          } else {
            successCount++
            if (data?.statusChanged) {
              changedCount++
            }
          }
        } catch (error) {
          console.error(`💥 Exception refreshing order ${order.id}:`, error)
          errorCount++
        }
      }))

      // Small delay between batches
      if (i + batchSize < orders.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    console.log(`✅ Bulk refresh completed: ${successCount} success, ${errorCount} errors, ${changedCount} changed`)

    return new Response(
      JSON.stringify({
        success: true,
        totalOrders: orders.length,
        successCount,
        errorCount,
        changedCount,
        message: `Processed ${orders.length} orders with ${changedCount} status changes`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('💥 Error in bulk refresh:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to bulk refresh payment status'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
