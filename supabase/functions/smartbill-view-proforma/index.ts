
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

async function fetchProformaPDF(auth: string, companyVat: string, proformaSeries: string, proformaNumber: string) {
  const pdfUrl = `https://ws.smartbill.ro/SBORO/api/estimate/pdf?cif=${companyVat}&seriesname=${encodeURIComponent(proformaSeries)}&number=${encodeURIComponent(proformaNumber)}`
  
  console.log('📄 Fetching proforma PDF:', {
    series: proformaSeries,
    number: proformaNumber,
    url: pdfUrl
  })
  
  const response = await rateLimitedFetch(pdfUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/octet-stream',
      'Content-Type': 'application/xml',
    },
  })

  console.log('📄 PDF response status:', response.status, response.statusText)

  if (!response.ok) {
    const errorText = await response.text()
    console.log('❌ PDF fetch error:', response.status, response.statusText, errorText.substring(0, 200))
    throw new Error(`SmartBill PDF API error: ${response.status} ${response.statusText} - ${errorText.substring(0, 100)}`)
  }

  return response
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

    const { orderId, proformaId } = await req.json();
    
    if (!orderId && !proformaId) {
      return new Response(
        JSON.stringify({ error: 'Order ID or Proforma ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📄 Fetching proforma PDF for order: ${orderId || 'direct proforma: ' + proformaId}`);

    let proformaSeries = 'STRP'; // Default series
    let proformaNumber = proformaId;

    // If orderId provided, get proforma details from order
    if (orderId) {
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
        smartbill_proforma_id: order.smartbill_proforma_id,
        total_price: order.total_price
      })

      if (!order.smartbill_proforma_id) {
        console.log('❌ No SmartBill proforma ID found for order');
        return new Response(
          JSON.stringify({ error: 'No SmartBill proforma ID found for this order' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Extract proforma details properly
      const details = extractProformaDetails(order)
      proformaSeries = details.series
      proformaNumber = details.number
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

    console.log('📄 Fetching PDF for proforma:', { series: proformaSeries, number: proformaNumber });

    // Fetch the PDF from SmartBill
    const pdfResponse = await fetchProformaPDF(smartbillAuth, smartbillCompanyVat, proformaSeries, proformaNumber);
    
    // Get the PDF data
    const pdfData = await pdfResponse.arrayBuffer();

    console.log(`✅ PDF fetched successfully, size: ${pdfData.byteLength} bytes`);

    // Return the PDF with proper headers
    return new Response(pdfData, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="proforma_${proformaSeries}${proformaNumber}.pdf"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('💥 Error fetching proforma PDF:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch proforma PDF',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
