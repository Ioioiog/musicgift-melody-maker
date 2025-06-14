
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Supabase credentials
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('smartbill_proforma_id')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Order fetch error:', orderError);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!order.smartbill_proforma_id) {
      return new Response(
        JSON.stringify({ error: 'No SmartBill proforma ID found for this order' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get SmartBill credentials
    const smartbillUsername = Deno.env.get('SMARTBILL_USERNAME');
    const smartbillToken = Deno.env.get('SMARTBILL_TOKEN');
    const smartbillCompanyVat = Deno.env.get('SMARTBILL_COMPANY_VAT');
    const smartbillSeries = Deno.env.get('SMARTBILL_SERIES') || 'STRP';

    if (!smartbillUsername || !smartbillToken || !smartbillCompanyVat) {
      console.error('Missing SmartBill credentials');
      return new Response(
        JSON.stringify({ error: 'SmartBill credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the proforma number - extract numeric part if it includes series prefix
    let proformaNumber = order.smartbill_proforma_id;
    
    // If the proforma ID starts with the series name, extract just the numeric part
    if (proformaNumber.startsWith(smartbillSeries)) {
      proformaNumber = proformaNumber.substring(smartbillSeries.length);
      console.log(`Extracted numeric part from ${order.smartbill_proforma_id}: ${proformaNumber}`);
    } else {
      console.log(`Using proforma number as-is: ${proformaNumber}`);
    }

    // Log the parameters we're sending to SmartBill
    console.log(`SmartBill API parameters:`, {
      cif: smartbillCompanyVat,
      seriesname: smartbillSeries,
      number: proformaNumber,
      originalProformaId: order.smartbill_proforma_id
    });

    // Construct SmartBill API URL for proforma PDF
    const smartbillUrl = `https://ws.smartbill.ro/SBORO/api/estimate/pdf?cif=${smartbillCompanyVat}&seriesname=${smartbillSeries}&number=${proformaNumber}`;

    // Create Basic Auth header
    const authString = btoa(`${smartbillUsername}:${smartbillToken}`);

    console.log(`Fetching proforma PDF from SmartBill: ${smartbillUrl}`);

    // Fetch PDF from SmartBill API with corrected headers
    const smartbillResponse = await fetch(smartbillUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/octet-stream',
        'Authorization': `Basic ${authString}`,
      },
    });

    if (!smartbillResponse.ok) {
      console.error('SmartBill API error:', smartbillResponse.status, smartbillResponse.statusText);
      const errorText = await smartbillResponse.text();
      console.error('SmartBill error response:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch proforma PDF from SmartBill',
          details: `Status: ${smartbillResponse.status}, ${smartbillResponse.statusText}`,
          proformaNumber: proformaNumber,
          originalProformaId: order.smartbill_proforma_id,
          smartbillError: errorText
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the PDF content
    const pdfContent = await smartbillResponse.arrayBuffer();

    console.log(`Successfully fetched PDF for proforma ${proformaNumber} (original: ${order.smartbill_proforma_id})`);

    // Return the PDF with proper headers
    return new Response(pdfContent, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="proforma-${proformaNumber}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error in smartbill-get-proforma-pdf function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
