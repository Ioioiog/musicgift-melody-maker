import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
}

// Rate limiting for SmartBill API (max 3 calls per second)
let lastApiCall = 0
const API_RATE_LIMIT = 334 // ms between calls

async function rateLimitedFetch(url: string, options: RequestInit) {
  const now = Date.now()
  const timeSinceLastCall = now - lastApiCall
  
  if (timeSinceLastCall < API_RATE_LIMIT) {
    await new Promise(resolve => setTimeout(resolve, API_RATE_LIMIT - timeSinceLastCall))
  }
  
  lastApiCall = Date.now()
  return fetch(url, options)
}

function extractDocumentDetails(order: any): { series: string, number: string, documentId: string } {
  console.log('📋 Extracting document details from order:', {
    smartbill_proforma_id: order.smartbill_proforma_id,
    smartbill_invoice_id: order.smartbill_invoice_id
  })

  // Try to extract from smartbill_proforma_id first (since we create proformas with payment links)
  let documentId = order.smartbill_proforma_id
  
  // If no proforma ID, check if we have invoice ID
  if (!documentId && order.smartbill_invoice_id) {
    documentId = order.smartbill_invoice_id
  }

  if (!documentId) {
    throw new Error('No SmartBill document ID found in order')
  }

  console.log('📄 Working with document ID:', documentId)

  // Extract series and number using regex
  // Expected formats: "STRP123", "Prof456", "mng789", etc.
  const seriesMatch = documentId.match(/^([a-zA-Z]+)/)
  const numberMatch = documentId.match(/(\d+)$/)
  
  if (!seriesMatch || !numberMatch) {
    console.error('❌ Failed to parse document ID:', documentId)
    throw new Error(`Invalid document ID format: ${documentId}`)
  }

  const series = seriesMatch[1]
  const number = numberMatch[1]

  console.log('✅ Extracted details:', { series, number, documentId })

  return { series, number, documentId }
}

async function checkPaymentStatus(auth: string, companyVat: string, series: string, number: string) {
  const paymentStatusUrl = `https://ws.smartbill.ro/SBORO/api/invoice/paymentstatus?cif=${encodeURIComponent(companyVat)}&seriesname=${encodeURIComponent(series)}&number=${encodeURIComponent(number)}`
  
  console.log('🔍 Checking payment status:', {
    series,
    number,
    cif: companyVat,
    url: paymentStatusUrl
  })
  
  try {
    const response = await rateLimitedFetch(paymentStatusUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })

    console.log('📊 Payment status API response:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ Payment status API error:', response.status, errorText.substring(0, 500))
      
      // Handle specific SmartBill errors
      if (response.status === 400 && errorText.includes('Factura nu a fost gasita')) {
        // Document not found - this is normal for very new documents
        return { 
          found: false,
          paid: false,
          errorText: 'Document not found or not yet processed',
          paymentData: null
        }
      }
      
      throw new Error(`SmartBill payment status API error: ${response.status} - ${errorText.substring(0, 200)}`)
    }

    const paymentData = await response.json()
    console.log('💰 Payment status data:', paymentData)
    
    // Analyze payment status
    const invoiceTotalAmount = paymentData?.invoiceTotalAmount || 0
    const paidAmount = paymentData?.paidAmount || 0
    const unpaidAmount = paymentData?.unpaidAmount || 0
    
    const isPaid = (paidAmount > 0 && unpaidAmount === 0) || (paidAmount >= invoiceTotalAmount && invoiceTotalAmount > 0)
    
    console.log(`💰 Payment analysis: Total=${invoiceTotalAmount}, Paid=${paidAmount}, Unpaid=${unpaidAmount}, IsPaid=${isPaid}`)
    
    return {
      found: true,
      paid: isPaid,
      paymentData: {
        total: invoiceTotalAmount,
        paid: paidAmount,
        unpaid: unpaidAmount
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking payment status:', error)
    throw error
  }
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

    console.log('🚀 SmartBill Status Sync - Starting...')

    // Parse request body
    const { orderId } = await req.json();
    
    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log(`🔍 Syncing status for order: ${orderId}`);

    // Get the order from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('❌ Order not found:', orderError);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: corsHeaders }
      );
    }

    console.log('📋 Order details:', {
      id: order.id,
      payment_status: order.payment_status,
      smartbill_payment_status: order.smartbill_payment_status,
      smartbill_proforma_id: order.smartbill_proforma_id,
      smartbill_invoice_id: order.smartbill_invoice_id,
      total_price: order.total_price
    })

    // Check if we have SmartBill document
    if (!order.smartbill_proforma_id && !order.smartbill_invoice_id) {
      console.log('❌ No SmartBill document found');
      return new Response(
        JSON.stringify({ error: 'No SmartBill document found for this order' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Get SmartBill credentials
    const smartbillUsername = Deno.env.get('SMARTBILL_USERNAME') || Deno.env.get('SMARTBILL_EMAIL');
    const smartbillToken = Deno.env.get('SMARTBILL_TOKEN');
    const smartbillCompanyVat = Deno.env.get('SMARTBILL_COMPANY_VAT');
    
    if (!smartbillUsername || !smartbillToken || !smartbillCompanyVat) {
      console.error('❌ SmartBill credentials not configured');
      return new Response(
        JSON.stringify({ error: 'SmartBill credentials not configured' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Create auth token
    const smartbillAuth = btoa(`${smartbillUsername}:${smartbillToken}`);
    console.log('🔐 SmartBill auth created');
    
    // Extract document details
    let documentDetails;
    try {
      documentDetails = extractDocumentDetails(order);
    } catch (error) {
      console.error('❌ Failed to extract document details:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to extract document details from order',
          details: error.message 
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { series, number, documentId } = documentDetails;
    console.log('📄 Checking document:', { series, number, documentId });

    // Check payment status
    let paymentResult;
    try {
      paymentResult = await checkPaymentStatus(smartbillAuth, smartbillCompanyVat, series, number);
    } catch (error) {
      console.error('❌ Failed to check payment status:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to check payment status with SmartBill',
          details: error.message
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('📊 Payment result:', paymentResult)

    // Determine new status based on payment result
    let newSmartbillStatus = order.smartbill_payment_status;
    let newPaymentStatus = order.payment_status;
    let newOrderStatus = order.status;

    if (paymentResult.found && paymentResult.paid) {
      // Payment confirmed
      newSmartbillStatus = 'confirmed';
      newPaymentStatus = 'completed';
      newOrderStatus = 'completed';
      
      console.log(`✅ Payment confirmed for order ${orderId}`);
    } else if (paymentResult.found && !paymentResult.paid) {
      // Document found but not paid
      newSmartbillStatus = 'pending';
      console.log('ℹ️ Payment still pending');
    } else if (!paymentResult.found) {
      // Document not found (might be too new)
      console.log('⚠️ Document not found in SmartBill - might be too new');
      // Keep current status
    }

    // Update order if status changed
    const updateData: any = {
      updated_at: new Date().toISOString(),
      webhook_processed_at: new Date().toISOString()
    };

    let statusChanged = false;
    if (newSmartbillStatus !== order.smartbill_payment_status) {
      updateData.smartbill_payment_status = newSmartbillStatus;
      statusChanged = true;
    }
    if (newPaymentStatus !== order.payment_status) {
      updateData.payment_status = newPaymentStatus;
      statusChanged = true;
    }
    if (newOrderStatus !== order.status) {
      updateData.status = newOrderStatus;
      statusChanged = true;
    }

    if (statusChanged) {
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

      console.log(`✅ Order ${orderId} status updated - SmartBill: ${newSmartbillStatus}, Payment: ${newPaymentStatus}`);
    } else {
      console.log(`ℹ️ Order ${orderId} status unchanged`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        statusChanged,
        documentFound: paymentResult.found,
        paymentConfirmed: paymentResult.paid,
        currentSmartbillStatus: newSmartbillStatus,
        currentPaymentStatus: newPaymentStatus,
        currentOrderStatus: newOrderStatus,
        paymentData: paymentResult.paymentData,
        message: statusChanged ? 'Status updated successfully' : 'Status checked - no changes needed',
        debugInfo: {
          documentId,
          series,
          number,
          paymentResult
        }
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('💥 Error in SmartBill status sync:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
