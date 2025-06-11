
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SmartBillWebhookPayload {
  invoiceId?: string;
  proformaId?: string;
  documentId?: string;
  paymentStatus?: string;
  status?: string;
  amount?: number;
  currency?: string;
  transactionId?: string;
  paymentDate?: string;
  paymentMethod?: string;
  documentType?: string;
  orderReference?: string;
}

function normalizePaymentStatus(status: string): { paymentStatus: string; orderStatus: string } {
  const normalizedStatus = status?.toLowerCase() || 'unknown'
  
  console.log('🔄 Normalizing payment status:', status, '->', normalizedStatus)
  
  // Map various possible SmartBill statuses to our internal statuses
  switch (normalizedStatus) {
    case 'paid':
    case 'completed':
    case 'success':
    case 'successful':
    case 'confirmed':
    case 'approved':
      return { paymentStatus: 'completed', orderStatus: 'confirmed' }
    
    case 'failed':
    case 'error':
    case 'declined':
    case 'rejected':
      return { paymentStatus: 'failed', orderStatus: 'cancelled' }
    
    case 'cancelled':
    case 'canceled':
    case 'voided':
      return { paymentStatus: 'cancelled', orderStatus: 'cancelled' }
    
    case 'pending':
    case 'processing':
    case 'in_progress':
    case 'awaiting':
      return { paymentStatus: 'pending', orderStatus: 'pending' }
    
    case 'refunded':
    case 'reversed':
      return { paymentStatus: 'refunded', orderStatus: 'refunded' }
    
    default:
      console.warn('⚠️ Unknown payment status received:', status)
      return { paymentStatus: 'pending', orderStatus: 'pending' }
  }
}

async function findOrderByDocumentId(supabaseClient: any, documentId: string) {
  console.log('🔍 Searching for order with document ID:', documentId)
  
  // Try to find by SmartBill invoice ID first
  let { data: order, error } = await supabaseClient
    .from('orders')
    .select('*')
    .eq('smartbill_invoice_id', documentId)
    .maybeSingle()

  if (!error && order) {
    console.log('✅ Order found by invoice ID:', order.id)
    return order
  }

  // Try to find by SmartBill proforma ID
  const { data: proformaOrder, error: proformaError } = await supabaseClient
    .from('orders')
    .select('*')
    .eq('smartbill_proforma_id', documentId)
    .maybeSingle()

  if (!proformaError && proformaOrder) {
    console.log('✅ Order found by proforma ID:', proformaOrder.id)
    return proformaOrder
  }

  // Try partial matches for cases where document ID might be modified
  const { data: partialMatches, error: partialError } = await supabaseClient
    .from('orders')
    .select('*')
    .or(`smartbill_invoice_id.ilike.%${documentId}%,smartbill_proforma_id.ilike.%${documentId}%`)

  if (!partialError && partialMatches && partialMatches.length > 0) {
    console.log('✅ Order found by partial match:', partialMatches[0].id)
    return partialMatches[0]
  }

  console.error('❌ No order found for document ID:', documentId)
  throw new Error(`Order not found for document ID: ${documentId}`)
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
    console.log('📨 SmartBill webhook received:', {
      ...webhookData,
      // Don't log sensitive payment data in full
      amount: webhookData.amount ? `${webhookData.amount} ${webhookData.currency}` : 'N/A'
    })

    // Extract document ID from multiple possible fields
    const documentId = webhookData.invoiceId || 
                      webhookData.proformaId || 
                      webhookData.documentId ||
                      webhookData.orderReference

    if (!documentId) {
      console.error('❌ No document ID found in webhook data')
      throw new Error('Document ID is required in webhook payload')
    }

    // Extract payment status from multiple possible fields
    const paymentStatus = webhookData.paymentStatus || 
                         webhookData.status || 
                         'unknown'

    console.log('📋 Processing webhook for document:', documentId, 'with status:', paymentStatus)

    // Find the order by document ID
    const order = await findOrderByDocumentId(supabaseClient, documentId)

    // Normalize the payment status
    const { paymentStatus: newPaymentStatus, orderStatus: newOrderStatus } = normalizePaymentStatus(paymentStatus)

    console.log('🔄 Status mapping:', {
      originalStatus: paymentStatus,
      newPaymentStatus,
      newOrderStatus,
      orderId: order.id
    })

    // Prepare update data
    const updateData: any = {
      payment_status: newPaymentStatus,
      status: newOrderStatus,
      smartbill_payment_status: paymentStatus,
      updated_at: new Date().toISOString(),
      webhook_processed_at: new Date().toISOString()
    }

    // Add transaction details if available
    if (webhookData.transactionId) {
      updateData.payment_id = webhookData.transactionId
    }

    // Add payment method if available
    if (webhookData.paymentMethod) {
      updateData.payment_method = webhookData.paymentMethod
    }

    // If this is an invoice confirmation, update the invoice ID
    if (webhookData.invoiceId && !order.smartbill_invoice_id) {
      updateData.smartbill_invoice_id = webhookData.invoiceId
      console.log('📄 Setting invoice ID from webhook:', webhookData.invoiceId)
    }

    // Update order with payment information
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update(updateData)
      .eq('id', order.id)

    if (updateError) {
      console.error('❌ Failed to update order:', updateError)
      throw new Error(`Failed to update order: ${updateError.message}`)
    }

    console.log(`✅ Order ${order.id} updated successfully:`, {
      status: newOrderStatus,
      paymentStatus: newPaymentStatus,
      smartbillStatus: paymentStatus
    })

    // Handle post-payment actions
    if (newPaymentStatus === 'completed') {
      console.log('🎉 Payment completed - order confirmed')
      console.log('ℹ️ Invoice conversion disabled - use admin panel to manually convert proforma to invoice')
      
    } else if (newPaymentStatus === 'failed' || newPaymentStatus === 'cancelled') {
      console.log('❌ Payment failed or cancelled')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: order.id,
        message: `Webhook processed successfully - order status updated to ${newOrderStatus}. Use admin panel to manually convert proforma to invoice if needed.`,
        paymentStatus: newPaymentStatus,
        manualConversionRequired: newPaymentStatus === 'completed' && order.smartbill_proforma_id && !order.smartbill_invoice_id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('💥 Error processing SmartBill webhook:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to process webhook'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
