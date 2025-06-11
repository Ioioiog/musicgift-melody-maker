
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

// Rate limiting for SmartBill API
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

async function checkSmartBillDocument(auth: string, companyVat: string, documentSeries: string, documentNumber: string, documentType: 'invoice' | 'estimate' = 'invoice') {
  const endpoint = documentType === 'invoice' ? 'invoice' : 'estimate'
  const paymentStatusUrl = `https://ws.smartbill.ro/SBORO/api/${endpoint}/paymentstatus?cif=${companyVat}&seriesname=${encodeURIComponent(documentSeries)}&number=${encodeURIComponent(documentNumber)}`
  
  console.log(`🔍 Checking ${documentType} payment status:`, {
    series: documentSeries,
    number: documentNumber,
    url: paymentStatusUrl
  })
  
  const response = await rateLimitedFetch(paymentStatusUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    console.log(`❌ ${documentType} API error:`, response.status, response.statusText)
    return null
  }

  const data: SmartBillPaymentStatusResponse = await response.json()
  console.log(`📊 ${documentType} payment data:`, data)
  
  if (data.errorText) {
    console.log(`⚠️ ${documentType} API returned error:`, data.errorText)
    return null
  }

  return data
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

    console.log(`🔄 Syncing SmartBill status for order: ${orderId}`);

    // Get the order including SmartBill data
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('❌ Order not found:', orderError);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get SmartBill credentials
    const smartbillUsername = Deno.env.get('SMARTBILL_USERNAME');
    const smartbillToken = Deno.env.get('SMARTBILL_TOKEN');
    const smartbillCompanyVat = Deno.env.get('SMARTBILL_COMPANY_VAT');
    
    if (!smartbillUsername || !smartbillToken || !smartbillCompanyVat) {
      console.error('❌ SmartBill credentials not configured');
      return new Response(
        JSON.stringify({ error: 'SmartBill credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const smartbillAuth = btoa(`${smartbillUsername}:${smartbillToken}`);
    
    let paymentData = null;
    let documentUsed = null;

    // First, try to check invoice if we have invoice data
    if (order.smartbill_invoice_id) {
      console.log('📄 Checking invoice:', order.smartbill_invoice_id);
      
      // Try to extract series and number from invoice ID or data
      let invoiceSeries = '';
      let invoiceNumber = order.smartbill_invoice_id;
      
      if (order.smartbill_invoice_data) {
        const invoiceData = order.smartbill_invoice_data as SmartBillInvoiceData;
        invoiceSeries = invoiceData.series || '';
        invoiceNumber = invoiceData.number || order.smartbill_invoice_id;
      }

      paymentData = await checkSmartBillDocument(smartbillAuth, smartbillCompanyVat, invoiceSeries, invoiceNumber, 'invoice');
      if (paymentData) {
        documentUsed = { type: 'invoice', series: invoiceSeries, number: invoiceNumber };
      }
    }

    // If no invoice data or invoice check failed, try proforma
    if (!paymentData && order.smartbill_proforma_id) {
      console.log('📄 Checking proforma:', order.smartbill_proforma_id);
      
      let proformaSeries = 'STRP'; // Default series for proformas
      let proformaNumber = order.smartbill_proforma_id;
      
      if (order.smartbill_proforma_data) {
        const proformaData = order.smartbill_proforma_data as SmartBillInvoiceData;
        proformaSeries = proformaData.series || 'STRP';
        proformaNumber = proformaData.number || order.smartbill_proforma_id;
      }

      paymentData = await checkSmartBillDocument(smartbillAuth, smartbillCompanyVat, proformaSeries, proformaNumber, 'estimate');
      if (paymentData) {
        documentUsed = { type: 'proforma', series: proformaSeries, number: proformaNumber };
      }
    }

    // If we still don't have payment data, return error
    if (!paymentData) {
      console.log('❌ No SmartBill document data found or all checks failed');
      return new Response(
        JSON.stringify({ 
          error: 'No SmartBill invoice or proforma data found, or payment status unavailable',
          currentStatus: order.smartbill_payment_status 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ Found payment data for ${documentUsed.type}:`, documentUsed);

    // Determine payment status based on SmartBill response
    let newSmartbillStatus = order.smartbill_payment_status;
    let newPaymentStatus = order.payment_status;

    const { invoiceTotalAmount, paidAmount, unpaidAmount } = paymentData;
    
    console.log(`💰 Payment details - Total: ${invoiceTotalAmount}, Paid: ${paidAmount}, Unpaid: ${unpaidAmount}`);

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
      last_status_check_at: new Date().toISOString(),
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
        console.error('❌ Error updating order:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update order status' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`✅ Order ${orderId} status updated - SmartBill: ${newSmartbillStatus}, Payment: ${newPaymentStatus}`);
    } else {
      console.log(`ℹ️ Order ${orderId} status unchanged - already up to date`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        statusChanged,
        currentSmartbillStatus: newSmartbillStatus,
        currentPaymentStatus: newPaymentStatus,
        documentChecked: documentUsed,
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
    console.error('💥 Error in SmartBill status sync:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
