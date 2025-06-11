import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
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
  console.log('📋 Extracting proforma details from order:', {
    smartbill_proforma_id: order.smartbill_proforma_id,
    smartbill_invoice_id: order.smartbill_invoice_id
  })

  // Try to extract from smartbill_proforma_id first
  let proformaId = order.smartbill_proforma_id
  
  // If no proforma ID, check if we have invoice ID (in case it was stored there)
  if (!proformaId && order.smartbill_invoice_id) {
    proformaId = order.smartbill_invoice_id
  }

  if (!proformaId) {
    throw new Error('No proforma or invoice ID found in order')
  }

  console.log('📄 Working with document ID:', proformaId)

  // Extract series and number using regex
  // Expected formats: "STRP123", "Prof456", "mng789", etc.
  const seriesMatch = proformaId.match(/^([a-zA-Z]+)/)
  const numberMatch = proformaId.match(/(\d+)$/)
  
  if (!seriesMatch || !numberMatch) {
    console.error('❌ Failed to parse document ID:', proformaId)
    throw new Error(`Invalid document ID format: ${proformaId}`)
  }

  const series = seriesMatch[1]
  const number = numberMatch[1]

  console.log('✅ Extracted details:', { series, number, original: proformaId })

  return { series, number }
}

async function checkProformaInvoiceStatus(auth: string, companyVat: string, proformaSeries: string, proformaNumber: string) {
  // Properly encode URL parameters to handle special characters
  const encodedSeries = encodeURIComponent(proformaSeries)
  const encodedNumber = encodeURIComponent(proformaNumber)
  const encodedCif = encodeURIComponent(companyVat)
  
  const estimateInvoicesUrl = `https://ws.smartbill.ro/SBORO/api/estimate/invoices?cif=${encodedCif}&seriesName=${encodedSeries}&number=${encodedNumber}`
  
  console.log('🔍 Checking proforma invoice status:', {
    series: proformaSeries,
    number: proformaNumber,
    cif: companyVat,
    url: estimateInvoicesUrl
  })
  
  try {
    // Use PUT method as shown in SmartBill documentation
    const response = await rateLimitedFetch(estimateInvoicesUrl, {
      method: 'PUT', // SmartBill uses PUT for this endpoint
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
    })

    console.log('📊 SmartBill API response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ Estimate invoices API error:', response.status, response.statusText, errorText.substring(0, 500))
      
      // Handle specific SmartBill errors more gracefully
      if (response.status === 400) {
        if (errorText.includes('seria proformei trebuie specificata') || errorText.includes('seriesName')) {
          throw new Error(`SmartBill API error: Series name parameter issue. Series: "${proformaSeries}", Number: "${proformaNumber}"`)
        }
        if (errorText.includes('nu a fost facturata') || errorText.includes('not invoiced')) {
          // This is expected when proforma hasn't been invoiced yet
          return { areInvoicesCreated: false, invoices: [], errorText: 'Proforma not yet invoiced' }
        }
      }
      
      throw new Error(`SmartBill API error: ${response.status} ${response.statusText} - ${errorText.substring(0, 200)}`)
    }

    const xmlText = await response.text()
    console.log('📊 Raw XML response:', xmlText.substring(0, 500))
    
    return parseXmlResponse(xmlText)
    
  } catch (error) {
    console.error('❌ Error in checkProformaInvoiceStatus:', error)
    
    // Re-throw with more context
    if (error.message.includes('SmartBill API error')) {
      throw error
    } else {
      throw new Error(`Network or parsing error: ${error.message}`)
    }
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

    const { orderId } = await req.json();
    
    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: corsHeaders }
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

    // Check if we have proforma data
    if (!order.smartbill_proforma_id && !order.smartbill_invoice_id) {
      console.log('❌ No SmartBill document ID found for order');
      return new Response(
        JSON.stringify({ error: 'No SmartBill proforma or invoice ID found for this order' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Get SmartBill credentials with validation
    const smartbillUsername = Deno.env.get('SMARTBILL_USERNAME') || Deno.env.get('SMARTBILL_EMAIL');
    const smartbillToken = Deno.env.get('SMARTBILL_TOKEN');
    const smartbillCompanyVat = Deno.env.get('SMARTBILL_COMPANY_VAT');
    
    if (!smartbillUsername || !smartbillToken || !smartbillCompanyVat) {
      console.error('❌ SmartBill credentials not configured properly:', {
        hasUsername: !!smartbillUsername,
        hasToken: !!smartbillToken,
        hasVat: !!smartbillCompanyVat
      });
      return new Response(
        JSON.stringify({ error: 'SmartBill credentials not configured' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Create auth token with proper base64 encoding
    const smartbillAuth = btoa(`${smartbillUsername}:${smartbillToken}`);
    console.log('🔐 SmartBill auth created, username length:', smartbillUsername.length);
    
    // Extract proforma series and number
    let proformaSeries: string;
    let proformaNumber: string;
    
    try {
      const details = extractProformaDetails(order);
      proformaSeries = details.series;
      proformaNumber = details.number;
    } catch (error) {
      console.error('❌ Failed to extract proforma details:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to extract proforma details from order data',
          details: error.message 
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('📄 Checking proforma:', { series: proformaSeries, number: proformaNumber });

    // Check if proforma has been invoiced
    let invoiceData: SmartBillEstimateInvoicesResponse;
    try {
      invoiceData = await checkProformaInvoiceStatus(smartbillAuth, smartbillCompanyVat, proformaSeries, proformaNumber);
    } catch (error) {
      console.error('❌ Failed to check proforma status:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to check proforma status with SmartBill',
          details: error.message,
          debugInfo: {
            proformaSeries,
            proformaNumber,
            companyVat: smartbillCompanyVat
          }
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('📊 Invoice data from SmartBill:', invoiceData)

    // Update order status based on invoice creation
    let newSmartbillStatus = order.smartbill_payment_status;
    let newPaymentStatus = order.payment_status;
    let newInvoiceId = order.smartbill_invoice_id;

    if (invoiceData.areInvoicesCreated && invoiceData.invoices && invoiceData.invoices.length > 0) {
      // Proforma has been converted to invoice(s)
      const firstInvoice = invoiceData.invoices[0];
      newInvoiceId = `${firstInvoice.series}${firstInvoice.number}`;
      newSmartbillStatus = 'confirmed'; // Updated status name
      newPaymentStatus = 'completed';
      
      console.log(`✅ Proforma has been invoiced: ${newInvoiceId}`);
    } else {
      // Proforma not yet invoiced - check payment status directly
      try {
        // Use the payment status API to check if proforma is paid
        const paymentStatusUrl = `https://ws.smartbill.ro/SBORO/api/invoice/paymentstatus?cif=${encodeURIComponent(smartbillCompanyVat)}&seriesname=${encodeURIComponent(proformaSeries)}&number=${encodeURIComponent(proformaNumber)}`;
        
        const paymentResponse = await rateLimitedFetch(paymentStatusUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${smartbillAuth}`,
            'Accept': 'application/json',
          },
        });

        if (paymentResponse.ok) {
          const paymentResult = await paymentResponse.json();
          console.log('💰 Payment status result:', paymentResult);
          
          const invoiceTotalAmount = paymentResult?.invoiceTotalAmount || 0;
          const paidAmount = paymentResult?.paidAmount || 0;
          const unpaidAmount = paymentResult?.unpaidAmount || 0;
          
          const isPaid = (paidAmount > 0 && unpaidAmount === 0) || (paidAmount >= invoiceTotalAmount && invoiceTotalAmount > 0);
          
          if (isPaid) {
            newSmartbillStatus = 'confirmed';
            newPaymentStatus = 'completed';
            console.log('✅ Proforma is paid but not yet converted to invoice');
          } else {
            newSmartbillStatus = 'pending';
            console.log('ℹ️ Proforma is not yet paid');
          }
        } else {
          console.log('⚠️ Could not check payment status, keeping current status');
        }
      } catch (paymentError) {
        console.log('⚠️ Payment status check failed:', paymentError.message);
        // Keep current status if payment check fails
      }
      
      console.log('ℹ️ Proforma not yet invoiced, error:', invoiceData.errorText);
    }

    // Update the order with new status information
    const updateData: any = {
      updated_at: new Date().toISOString(),
      webhook_processed_at: new Date().toISOString(), // Use existing column
    };

    // Only update if status actually changed
    let statusChanged = false;
    if (newSmartbillStatus !== order.smartbill_payment_status) {
      updateData.smartbill_payment_status = newSmartbillStatus;
      statusChanged = true;
    }
    if (newPaymentStatus !== order.payment_status && newPaymentStatus === 'completed') {
      updateData.payment_status = newPaymentStatus;
      updateData.status = 'completed'; // Also update main order status
      statusChanged = true;
    }
    if (newInvoiceId && newInvoiceId !== order.smartbill_invoice_id) {
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
          { status: 500, headers: corsHeaders }
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