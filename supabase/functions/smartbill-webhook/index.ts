
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
    return { type: 'order', data: order }
  }

  // Try to find by SmartBill proforma ID
  const { data: proformaOrder, error: proformaError } = await supabaseClient
    .from('orders')
    .select('*')
    .eq('smartbill_proforma_id', documentId)
    .maybeSingle()

  if (!proformaError && proformaOrder) {
    console.log('✅ Order found by proforma ID:', proformaOrder.id)
    return { type: 'order', data: proformaOrder }
  }

  // Try partial matches for orders
  const { data: partialMatches, error: partialError } = await supabaseClient
    .from('orders')
    .select('*')
    .or(`smartbill_invoice_id.ilike.%${documentId}%,smartbill_proforma_id.ilike.%${documentId}%`)

  if (!partialError && partialMatches && partialMatches.length > 0) {
    console.log('✅ Order found by partial match:', partialMatches[0].id)
    return { type: 'order', data: partialMatches[0] }
  }

  console.log('❌ No order found, searching for gift card...')
  return null
}

async function findGiftCardByDocumentId(supabaseClient: any, documentId: string) {
  console.log('🎁 Searching for gift card with document ID:', documentId)
  
  // Try to find by SmartBill proforma ID
  const { data: giftCard, error } = await supabaseClient
    .from('gift_cards')
    .select('*')
    .eq('smartbill_proforma_id', documentId)
    .maybeSingle()

  if (!error && giftCard) {
    console.log('✅ Gift card found by proforma ID:', giftCard.id)
    return { type: 'gift_card', data: giftCard }
  }

  // Try partial matches for gift cards
  const { data: partialMatches, error: partialError } = await supabaseClient
    .from('gift_cards')
    .select('*')
    .ilike('smartbill_proforma_id', `%${documentId}%`)

  if (!partialError && partialMatches && partialMatches.length > 0) {
    console.log('✅ Gift card found by partial match:', partialMatches[0].id)
    return { type: 'gift_card', data: partialMatches[0] }
  }

  console.log('❌ No gift card found for document ID:', documentId)
  return null
}

async function updateOrderStatus(supabaseClient: any, order: any, webhookData: SmartBillWebhookPayload, paymentStatus: string, orderStatus: string) {
  const updateData: any = {
    payment_status: paymentStatus,
    status: orderStatus,
    smartbill_payment_status: webhookData.paymentStatus || webhookData.status || 'unknown',
    updated_at: new Date().toISOString(),
    webhook_processed_at: new Date().toISOString()
  }

  // Add transaction details if available
  if (webhookData.transactionId) {
    updateData.payment_id = webhookData.transactionId
  }

  if (webhookData.paymentMethod) {
    updateData.payment_method = webhookData.paymentMethod
  }

  if (webhookData.invoiceId && !order.smartbill_invoice_id) {
    updateData.smartbill_invoice_id = webhookData.invoiceId
  }

  const { error: updateError } = await supabaseClient
    .from('orders')
    .update(updateData)
    .eq('id', order.id)

  if (updateError) {
    throw new Error(`Failed to update order: ${updateError.message}`)
  }

  console.log(`✅ Order ${order.id} updated successfully`)
}

async function updateGiftCardStatus(supabaseClient: any, giftCard: any, webhookData: SmartBillWebhookPayload, paymentStatus: string) {
  const updateData: any = {
    payment_status: paymentStatus,
    smartbill_proforma_status: paymentStatus,
    updated_at: new Date().toISOString(),
    webhook_processed_at: new Date().toISOString()
  }

  // Add transaction details if available
  if (webhookData.transactionId) {
    updateData.payment_id = webhookData.transactionId
  }

  if (webhookData.paymentMethod) {
    updateData.payment_method = webhookData.paymentMethod
  }

  const { error: updateError } = await supabaseClient
    .from('gift_cards')
    .update(updateData)
    .eq('id', giftCard.id)

  if (updateError) {
    throw new Error(`Failed to update gift card: ${updateError.message}`)
  }

  console.log(`✅ Gift card ${giftCard.id} updated successfully`)
}

async function triggerGiftCardEmails(supabaseClient: any, giftCard: any) {
  console.log('📧 Triggering gift card email delivery for:', giftCard.id)
  
  try {
    // Send gift card to recipient
    const { error: deliveryError } = await supabaseClient.functions.invoke('send-gift-card-email', {
      body: { giftCardId: giftCard.id }
    })

    if (deliveryError) {
      console.error('❌ Failed to send gift card delivery email:', deliveryError)
    } else {
      console.log('✅ Gift card delivery email sent successfully')
    }

    // Send purchase confirmation to buyer
    const { error: confirmationError } = await supabaseClient.functions.invoke('send-gift-card-purchase-confirmation', {
      body: {
        giftCardId: giftCard.id,
        purchaserEmail: giftCard.sender_email,
        purchaserName: giftCard.sender_name,
        recipientName: giftCard.recipient_name,
        recipientEmail: giftCard.recipient_email,
        amount: giftCard.gift_amount,
        currency: giftCard.currency,
        deliveryDate: giftCard.delivery_date,
        personalMessage: giftCard.message_text,
        designName: 'Selected Design'
      }
    })

    if (confirmationError) {
      console.error('❌ Failed to send purchase confirmation email:', confirmationError)
    } else {
      console.log('✅ Purchase confirmation email sent successfully')
    }

  } catch (error) {
    console.error('❌ Error triggering gift card emails:', error)
  }
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

    // First try to find an order
    let record = await findOrderByDocumentId(supabaseClient, documentId)
    
    // If no order found, try to find a gift card
    if (!record) {
      record = await findGiftCardByDocumentId(supabaseClient, documentId)
    }

    if (!record) {
      console.error('❌ No order or gift card found for document ID:', documentId)
      throw new Error(`No order or gift card found for document ID: ${documentId}`)
    }

    // Normalize the payment status
    const { paymentStatus: newPaymentStatus, orderStatus: newOrderStatus } = normalizePaymentStatus(paymentStatus)

    console.log('🔄 Status mapping:', {
      originalStatus: paymentStatus,
      newPaymentStatus,
      newOrderStatus,
      recordType: record.type,
      recordId: record.data.id
    })

    if (record.type === 'order') {
      // Handle order payment
      await updateOrderStatus(supabaseClient, record.data, webhookData, newPaymentStatus, newOrderStatus)

      // Handle post-payment actions for orders
      if (newPaymentStatus === 'completed') {
        console.log('🎉 Order payment completed')
      } else if (newPaymentStatus === 'failed' || newPaymentStatus === 'cancelled') {
        console.log('❌ Order payment failed or cancelled')
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          orderId: record.data.id,
          message: `Order webhook processed successfully - status updated to ${newOrderStatus}`,
          paymentStatus: newPaymentStatus
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )

    } else if (record.type === 'gift_card') {
      // Handle gift card payment
      await updateGiftCardStatus(supabaseClient, record.data, webhookData, newPaymentStatus)

      // Handle post-payment actions for gift cards
      if (newPaymentStatus === 'completed') {
        console.log('🎉 Gift card payment completed - triggering email delivery')
        await triggerGiftCardEmails(supabaseClient, record.data)
      } else if (newPaymentStatus === 'failed' || newPaymentStatus === 'cancelled') {
        console.log('❌ Gift card payment failed or cancelled')
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          giftCardId: record.data.id,
          message: `Gift card webhook processed successfully - status updated to ${newPaymentStatus}`,
          paymentStatus: newPaymentStatus
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

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
