
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SmartBillEstimateInvoicesResponse {
  errorText?: string;
  message?: string;
  areInvoicesCreated: boolean;
  invoices?: Array<{
    series: string;
    number: string;
  }>;
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

function parseXmlResponse(xmlText: string): SmartBillEstimateInvoicesResponse {
  console.log('📄 Parsing XML response:', xmlText.substring(0, 500))
  
  try {
    // Check for error messages first
    const errorMatch = xmlText.match(/<errorText>(.*?)<\/errorText>/s)
    if (errorMatch) {
      console.log('⚠️ SmartBill API returned error:', errorMatch[1])
      // If proforma not invoiced yet, this is not an error - just means pending
      if (errorMatch[1].includes('nu a fost facturata') || errorMatch[1].includes('not invoiced')) {
        return { areInvoicesCreated: false, invoices: [], errorText: errorMatch[1] }
      }
      return { areInvoicesCreated: false, invoices: [], errorText: errorMatch[1] }
    }

    // Check for areInvoicesCreated
    const areInvoicesCreatedMatch = xmlText.match(/<areInvoicesCreated>(.*?)<\/areInvoicesCreated>/s)
    const areInvoicesCreated = areInvoicesCreatedMatch?.[1] === 'true' || areInvoicesCreatedMatch?.[1] === '1'

    // Parse invoices if they exist
    const invoices: Array<{series: string, number: string}> = []
    
    // Find all invoice blocks
    const invoiceMatches = xmlText.matchAll(/<invoice>(.*?)<\/invoice>/gs)
    for (const match of invoiceMatches) {
      const invoiceXml = match[1]
      const seriesMatch = invoiceXml.match(/<series>(.*?)<\/series>/)
      const numberMatch = invoiceXml.match(/<number>(.*?)<\/number>/)
      
      if (seriesMatch && numberMatch) {
        invoices.push({
          series: seriesMatch[1],
          number: numberMatch[1]
        })
      }
    }

    return {
      areInvoicesCreated,
      invoices
    }
  } catch (error) {
    console.error('❌ Error parsing XML response:', error)
    return {
      areInvoicesCreated: false,
      invoices: [],
      errorText: `XML parsing error: ${error.message}`
    }
  }
}

function extractProformaDetails(order: any): { series: string, number: string } {
  let proformaSeries = 'STRP' // Default series
  let proformaNumber = order.smartbill_proforma_id || ''

  console.log('🔍 Extracting proforma details from order:', {
    smartbill_proforma_id: order.smartbill_proforma_id,
    smartbill_proforma_data: typeof order.smartbill_proforma_data
  })

  // Try to extract from smartbill_proforma_data if available
  if (order.smartbill_proforma_data) {
    try {
      // Handle if it's a string (XML) or object
      let proformaData = order.smartbill_proforma_data
      
      if (typeof proformaData === 'string') {
        // Parse XML to extract series and number
        const seriesMatch = proformaData.match(/<series>(.*?)<\/series>/)
        const numberMatch = proformaData.match(/<number>(.*?)<\/number>/)
        
        if (seriesMatch) proformaSeries = seriesMatch[1]
        if (numberMatch) proformaNumber = numberMatch[1]
      } else if (typeof proformaData === 'object') {
        // Handle as JSON object
        proformaSeries = proformaData.series || 'STRP'
        proformaNumber = proformaData.number || order.smartbill_proforma_id
      }
    } catch (error) {
      console.log('⚠️ Error parsing proforma data:', error)
    }
  }

  console.log('📋 Extracted proforma details:', { series: proformaSeries, number: proformaNumber })
  return { series: proformaSeries, number: proformaNumber }
}

async function checkProformaInvoiceStatus(auth: string, companyVat: string, proformaSeries: string, proformaNumber: string) {
  const estimateInvoicesUrl = `https://ws.smartbill.ro/SBORO/api/estimate/invoices?cif=${companyVat}&seriesName=${encodeURIComponent(proformaSeries)}&number=${encodeURIComponent(proformaNumber)}`
  
  console.log('🔍 Checking proforma invoice status:', {
    series: proformaSeries,
    number: proformaNumber,
    url: estimateInvoicesUrl
  })
  
  const response = await rateLimitedFetch(estimateInvoicesUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/xml',
      'Content-Type': 'application/xml',
    },
  })

  console.log('📊 SmartBill API response status:', response.status, response.statusText)

  if (!response.ok) {
    const errorText = await response.text()
    console.log('❌ Estimate invoices API error:', response.status, response.statusText, errorText.substring(0, 200))
    throw new Error(`SmartBill API error: ${response.status} ${response.statusText} - ${errorText.substring(0, 100)}`)
  }

  const xmlText = await response.text()
  console.log('📊 Raw XML response:', xmlText.substring(0, 500))
  
  return parseXmlResponse(xmlText)
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

    console.log('📋 Order details:', {
      id: order.id,
      payment_status: order.payment_status,
      smartbill_payment_status: order.smartbill_payment_status,
      smartbill_proforma_id: order.smartbill_proforma_id,
      total_price: order.total_price
    })

    // Check if we have proforma data
    if (!order.smartbill_proforma_id) {
      console.log('❌ No SmartBill proforma ID found for order');
      return new Response(
        JSON.stringify({ error: 'No SmartBill proforma ID found for this order' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
    
    // Extract proforma series and number
    const { series: proformaSeries, number: proformaNumber } = extractProformaDetails(order)

    console.log('📄 Checking proforma:', { series: proformaSeries, number: proformaNumber });

    // Check if proforma has been invoiced
    const invoiceData = await checkProformaInvoiceStatus(smartbillAuth, smartbillCompanyVat, proformaSeries, proformaNumber);

    console.log('📊 Invoice data from SmartBill:', invoiceData)

    // Update order status based on invoice creation
    let newSmartbillStatus = order.smartbill_payment_status;
    let newPaymentStatus = order.payment_status;
    let newInvoiceId = order.smartbill_invoice_id;

    if (invoiceData.areInvoicesCreated && invoiceData.invoices && invoiceData.invoices.length > 0) {
      // Proforma has been converted to invoice(s)
      const firstInvoice = invoiceData.invoices[0];
      newInvoiceId = `${firstInvoice.series}${firstInvoice.number}`;
      newSmartbillStatus = 'paid'; // If invoice exists, consider it paid
      newPaymentStatus = 'completed';
      
      console.log(`✅ Proforma has been invoiced: ${newInvoiceId}`);
    } else {
      // Proforma not yet invoiced
      newSmartbillStatus = 'pending';
      
      console.log('ℹ️ Proforma not yet invoiced, error:', invoiceData.errorText);
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
    if (newPaymentStatus !== order.payment_status && newPaymentStatus === 'completed') {
      updateData.payment_status = newPaymentStatus;
      statusChanged = true;
    }
    if (newInvoiceId !== order.smartbill_invoice_id) {
      updateData.smartbill_invoice_id = newInvoiceId;
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
        invoiceCreated: invoiceData.areInvoicesCreated,
        invoiceId: newInvoiceId,
        invoices: invoiceData.invoices || [],
        message: statusChanged ? 'Status updated successfully' : 'Status checked - no changes needed',
        debugInfo: {
          proformaSeries,
          proformaNumber,
          smartbillResponse: invoiceData
        }
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
