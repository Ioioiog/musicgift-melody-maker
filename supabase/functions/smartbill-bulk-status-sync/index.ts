
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SmartBillPaymentStatusResponse {
  errorText: string;
  message: string;
  number: string;
  series: string;
  invoiceTotalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  paid?: boolean;
}

interface SmartBillInvoiceData {
  url?: string;
  number?: string;
  series?: string;
  message?: string;
  errorText?: string;
}

interface BulkSyncResult {
  orderId: string;
  success: boolean;
  statusChanged: boolean;
  currentSmartbillStatus?: string;
  currentPaymentStatus?: string;
  error?: string;
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

    console.log('Starting bulk SmartBill status sync');

    // Get all orders that have SmartBill invoice data
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, smartbill_invoice_id, smartbill_invoice_data, smartbill_payment_status, payment_status')
      .or('smartbill_invoice_id.neq.null,smartbill_invoice_data.neq.null')
      .neq('smartbill_payment_status', 'paid') // Skip already paid orders
      .order('created_at', { ascending: false });

    if (ordersError || !orders) {
      console.error('Error fetching orders:', ordersError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch orders for sync' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${orders.length} orders to sync`);

    // SmartBill API credentials
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

    // Process orders with controlled concurrency to avoid rate limits
    const concurrencyLimit = 5; // Process 5 orders at a time
    const results: BulkSyncResult[] = [];

    for (let i = 0; i < orders.length; i += concurrencyLimit) {
      const batch = orders.slice(i, i + concurrencyLimit);
      const batchPromises = batch.map(async (order): Promise<BulkSyncResult> => {
        try {
          return await syncSingleOrder(order, smartbillAuth, smartbillCompanyVat, supabase);
        } catch (error) {
          console.error(`Error syncing order ${order.id}:`, error);
          return {
            orderId: order.id,
            success: false,
            statusChanged: false,
            error: error.message
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Small delay between batches to be respectful to the API
      if (i + concurrencyLimit < orders.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const successCount = results.filter(r => r.success).length;
    const changedCount = results.filter(r => r.statusChanged).length;
    const errorCount = results.filter(r => !r.success).length;

    console.log(`Bulk sync completed: ${successCount} successful, ${changedCount} status changes, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        totalOrders: orders.length,
        successCount,
        changedCount,
        errorCount,
        results
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in bulk SmartBill status sync:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function syncSingleOrder(order: any, smartbillAuth: string, smartbillCompanyVat: string, supabase: any): Promise<BulkSyncResult> {
  // Extract series and number from smartbill_invoice_data
  let invoiceSeries = '';
  let invoiceNumber = '';

  if (order.smartbill_invoice_data) {
    const invoiceData = order.smartbill_invoice_data as SmartBillInvoiceData;
    invoiceSeries = invoiceData.series || '';
    invoiceNumber = invoiceData.number || '';
  }

  // Fallback to smartbill_invoice_id if invoice data doesn't have the required fields
  if (!invoiceSeries || !invoiceNumber) {
    if (order.smartbill_invoice_id) {
      invoiceNumber = order.smartbill_invoice_id;
    } else {
      return {
        orderId: order.id,
        success: false,
        statusChanged: false,
        error: 'No SmartBill invoice data available'
      };
    }
  }

  // Call SmartBill API to get invoice payment status
  const paymentStatusUrl = `https://ws.smartbill.ro/SBORO/api/invoice/paymentstatus?cif=${smartbillCompanyVat}&seriesname=${encodeURIComponent(invoiceSeries)}&number=${encodeURIComponent(invoiceNumber)}`;
  
  const smartbillResponse = await fetch(paymentStatusUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${smartbillAuth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!smartbillResponse.ok) {
    return {
      orderId: order.id,
      success: false,
      statusChanged: false,
      error: `SmartBill API error: HTTP ${smartbillResponse.status}`
    };
  }

  const responseData: SmartBillPaymentStatusResponse = await smartbillResponse.json();
  
  // Check for SmartBill errors
  if (responseData.errorText) {
    return {
      orderId: order.id,
      success: false,
      statusChanged: false,
      error: `SmartBill error: ${responseData.errorText}`
    };
  }

  // Determine payment status based on SmartBill response
  let newSmartbillStatus = order.smartbill_payment_status;
  let newPaymentStatus = order.payment_status;

  const { invoiceTotalAmount, paidAmount, unpaidAmount } = responseData;

  // Update status based on payment amounts
  if (unpaidAmount === 0 && paidAmount === invoiceTotalAmount) {
    newSmartbillStatus = 'paid';
    newPaymentStatus = 'completed';
  } else if (paidAmount > 0 && unpaidAmount > 0) {
    newSmartbillStatus = 'partially_paid';
    newPaymentStatus = 'pending';
  } else if (paidAmount === 0) {
    newSmartbillStatus = 'pending';
    newPaymentStatus = 'pending';
  }

  // Check if status actually changed
  const statusChanged = newSmartbillStatus !== order.smartbill_payment_status || newPaymentStatus !== order.payment_status;

  if (statusChanged) {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (newSmartbillStatus !== order.smartbill_payment_status) {
      updateData.smartbill_payment_status = newSmartbillStatus;
    }
    if (newPaymentStatus !== order.payment_status) {
      updateData.payment_status = newPaymentStatus;
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', order.id);

    if (updateError) {
      return {
        orderId: order.id,
        success: false,
        statusChanged: false,
        error: `Database update failed: ${updateError.message}`
      };
    }
  }

  return {
    orderId: order.id,
    success: true,
    statusChanged,
    currentSmartbillStatus: newSmartbillStatus,
    currentPaymentStatus: newPaymentStatus
  };
}
