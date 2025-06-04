
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SmartBillPaymentStatusResponse {
  sbcInvoicePaymentStatusResponse: {
    errorText: string;
    message: string;
    number: string;
    series: string;
    invoiceTotalAmount: number;
    paidAmount: number;
    unpaidAmount: number;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { orderId } = await req.json();
    
    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Syncing SmartBill status for order: ${orderId}`);

    // Get the order to find the SmartBill invoice ID
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('smartbill_invoice_id, smartbill_payment_status, payment_status')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Order not found:', orderError);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!order.smartbill_invoice_id) {
      console.log('Order has no SmartBill invoice ID');
      return new Response(
        JSON.stringify({ 
          error: 'Order has no SmartBill invoice ID',
          currentStatus: order.smartbill_payment_status 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call SmartBill API to get invoice payment status
    const smartbillUsername = Deno.env.get('SMARTBILL_USERNAME');
    const smartbillToken = Deno.env.get('SMARTBILL_TOKEN');
    const smartbillCompanyVat = Deno.env.get('SMARTBILL_COMPANY_VAT');
    
    if (!smartbillUsername || !smartbillToken || !smartbillCompanyVat) {
      console.error('SmartBill credentials not configured');
      return new Response(
        JSON.stringify({ error: 'SmartBill credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const smartbillAuth = btoa(`${smartbillUsername}:${smartbillToken}`);
    
    console.log(`Checking SmartBill payment status for invoice: ${order.smartbill_invoice_id}`);
    
    // Get invoice payment status from SmartBill using the correct endpoint
    const smartbillResponse = await fetch(`https://ws.smartbill.ro/SBORO/api/invoice/paymentstatus?cif=${smartbillCompanyVat}&seriesname=&number=${order.smartbill_invoice_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${smartbillAuth}`,
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
    });

    if (!smartbillResponse.ok) {
      console.error('SmartBill API error:', smartbillResponse.status, smartbillResponse.statusText);
      const errorText = await smartbillResponse.text();
      console.error('SmartBill error response:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to check SmartBill payment status',
          details: `HTTP ${smartbillResponse.status}: ${smartbillResponse.statusText}`,
          smartbillError: errorText
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const responseData: SmartBillPaymentStatusResponse = await smartbillResponse.json();
    console.log('SmartBill payment status response:', responseData);

    const paymentData = responseData.sbcInvoicePaymentStatusResponse;
    
    // Check for SmartBill errors
    if (paymentData.errorText) {
      console.error('SmartBill API returned error:', paymentData.errorText);
      return new Response(
        JSON.stringify({ 
          error: 'SmartBill API error',
          details: paymentData.errorText
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine payment status based on SmartBill response
    let newSmartbillStatus = order.smartbill_payment_status;
    let newPaymentStatus = order.payment_status;

    const { invoiceTotalAmount, paidAmount, unpaidAmount } = paymentData;
    
    console.log(`Payment details - Total: ${invoiceTotalAmount}, Paid: ${paidAmount}, Unpaid: ${unpaidAmount}`);

    // Update status based on payment amounts
    if (unpaidAmount === 0 && paidAmount === invoiceTotalAmount) {
      // Fully paid
      newSmartbillStatus = 'paid';
      newPaymentStatus = 'completed';
    } else if (paidAmount > 0 && unpaidAmount > 0) {
      // Partially paid
      newSmartbillStatus = 'partially_paid';
      newPaymentStatus = 'pending';
    } else if (paidAmount === 0) {
      // Not paid yet
      newSmartbillStatus = 'pending';
      newPaymentStatus = 'pending';
    }

    // Update the order with new status information
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Only update if status actually changed
    let statusChanged = false;
    if (newSmartbillStatus !== order.smartbill_payment_status) {
      updateData.smartbill_payment_status = newSmartbillStatus;
      statusChanged = true;
    }
    if (newPaymentStatus !== order.payment_status) {
      updateData.payment_status = newPaymentStatus;
      statusChanged = true;
    }

    if (statusChanged) {
      const { error: updateError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (updateError) {
        console.error('Error updating order:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update order status' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Order ${orderId} status updated - SmartBill: ${newSmartbillStatus}, Payment: ${newPaymentStatus}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        statusChanged,
        currentSmartbillStatus: newSmartbillStatus,
        currentPaymentStatus: newPaymentStatus,
        paymentDetails: {
          invoiceTotalAmount,
          paidAmount,
          unpaidAmount
        },
        message: statusChanged ? 'Status updated successfully' : 'Status checked - no changes needed'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in SmartBill status sync:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
