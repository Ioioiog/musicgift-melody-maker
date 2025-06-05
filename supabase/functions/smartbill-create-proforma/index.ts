
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Helper function to parse XML response
function parseXmlResponse(xmlText: string): any {
  // Simple XML parsing for SmartBill response
  // Look for key elements in the response
  const result: any = {};
  
  // Extract proforma number/ID
  const numberMatch = xmlText.match(/<number[^>]*>([^<]+)<\/number>/i);
  if (numberMatch) {
    result.number = numberMatch[1];
  }
  
  const idMatch = xmlText.match(/<id[^>]*>([^<]+)<\/id>/i);
  if (idMatch) {
    result.id = idMatch[1];
  }
  
  // Extract series
  const seriesMatch = xmlText.match(/<series[^>]*>([^<]+)<\/series>/i);
  if (seriesMatch) {
    result.series = seriesMatch[1];
  }
  
  // Extract URL if present
  const urlMatch = xmlText.match(/<url[^>]*>([^<]+)<\/url>/i);
  if (urlMatch) {
    result.url = urlMatch[1];
  }
  
  // Store raw XML for reference
  result.rawXml = xmlText;
  
  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { orderData } = await req.json();
    console.log('📄 Creating SmartBill proforma for order:', orderData.id);

    // Enhanced idempotency check - verify proforma doesn't already exist
    console.log('🔍 Checking for existing proforma/invoice for order:', orderData.id);
    
    // Refresh order data from database to get latest state
    const { data: currentOrder, error: fetchError } = await supabaseClient
      .from('orders')
      .select('smartbill_proforma_id, smartbill_invoice_id, smartbill_proforma_status')
      .eq('id', orderData.id)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching current order state:', fetchError);
      throw new Error(`Could not fetch order: ${fetchError.message}`);
    }

    if (currentOrder.smartbill_proforma_id || currentOrder.smartbill_invoice_id) {
      console.log('⚠️ Proforma/Invoice already exists for order:', {
        order_id: orderData.id,
        proforma_id: currentOrder.smartbill_proforma_id,
        invoice_id: currentOrder.smartbill_invoice_id,
        status: currentOrder.smartbill_proforma_status
      });
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Proforma already exists',
        proformaId: currentOrder.smartbill_proforma_id,
        orderId: orderData.id,
        duplicate: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const smartbillUsername = Deno.env.get('SMARTBILL_USERNAME');
    const smartbillToken = Deno.env.get('SMARTBILL_TOKEN');
    const smartbillCompanyVAT = Deno.env.get('SMARTBILL_COMPANY_VAT');

    if (!smartbillUsername || !smartbillToken || !smartbillCompanyVAT) {
      const missingSecrets = [];
      if (!smartbillUsername) missingSecrets.push('SMARTBILL_USERNAME');
      if (!smartbillToken) missingSecrets.push('SMARTBILL_TOKEN');
      if (!smartbillCompanyVAT) missingSecrets.push('SMARTBILL_COMPANY_VAT');
      
      const errorMessage = `Missing SmartBill credentials: ${missingSecrets.join(', ')}`;
      console.error('❌', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('🔑 SmartBill credentials found - proceeding with proforma creation');

    // Extract form data safely
    const formData = orderData.form_data || {};
    const customerName = escapeXml(formData.fullName || formData.customerName || 'N/A');
    const customerEmail = escapeXml(formData.email || '');
    const customerPhone = escapeXml(formData.phone || '');
    const customerAddress = escapeXml(formData.address || '');
    const customerCity = escapeXml(formData.city || '');
    const customerCounty = escapeXml(formData.county || '');

    // Calculate dates
    const issueDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 30 days from now

    // Determine payment status context
    const isPaymentCompleted = orderData.payment_completed_via || orderData.payment_status === 'completed';
    const paymentProvider = orderData.payment_completed_via || orderData.payment_provider || 'online';
    
    console.log('💳 Payment context - Completed via:', paymentProvider, 'Status:', orderData.payment_status);

    // Convert total_price from cents to currency units
    const totalPriceInCurrency = orderData.total_price ? (orderData.total_price / 100) : 0;
    console.log('💰 Price conversion:', orderData.total_price, 'cents ->', totalPriceInCurrency, orderData.currency || 'RON');

    // Enhanced mentions with payment tracking information
    let mentions = `Comanda #${orderData.id?.slice(0, 8)} - Cadou muzical personalizat. Pachet: ${orderData.package_name || orderData.package_value}`;
    
    if (isPaymentCompleted) {
      mentions += ` | Plată finalizată prin ${paymentProvider.toUpperCase()}`;
      
      // Add Stripe-specific payment details
      if (paymentProvider === 'stripe' && orderData.stripe_payment_intent_id) {
        mentions += ` (${orderData.stripe_payment_intent_id.slice(0, 16)}...)`;
      }
    }

    // Enhanced observations with more payment details
    let observations = `Plata ${isPaymentCompleted ? 'finalizată' : 'în procesare'} prin ${paymentProvider}. Status: ${orderData.payment_status}`;
    
    if (orderData.stripe_customer_id) {
      observations += ` | Client Stripe: ${orderData.stripe_customer_id}`;
    }
    
    if (orderData.webhook_processed_at) {
      observations += ` | Processat: ${orderData.webhook_processed_at}`;
    }

    // Escape mentions and observations for XML
    const escapedMentions = escapeXml(mentions);
    const escapedObservations = escapeXml(observations);
    const escapedPackageName = escapeXml(`${orderData.package_name || orderData.package_value} - Pachet Cadou Muzical`);
    const escapedPackageCode = escapeXml(orderData.package_value || "MUSIC-GIFT");

    // Build XML request body according to SmartBill API documentation
    const xmlBody = `<?xml version="1.0" encoding="UTF-8"?>
<request>
  <companyVatCode>${smartbillCompanyVAT}</companyVatCode>
  <client>
    <name>${customerName}</name>
    <email>${customerEmail}</email>
    <phone>${customerPhone}</phone>
    <address>${customerAddress}</address>
    <city>${customerCity}</city>
    <county>${customerCounty}</county>
    <country>Romania</country>
    <isTaxPayer>false</isTaxPayer>
    <saveToDb>true</saveToDb>
  </client>
  <seriesName>STRP</seriesName>
  <issueDate>${issueDate}</issueDate>
  <dueDate>${dueDate}</dueDate>
  <language>RO</language>
  <precision>2</precision>
  <currency>${orderData.currency || "RON"}</currency>
  <isDraft>false</isDraft>
  <mentions>${escapedMentions}</mentions>
  <observations>${escapedObservations}</observations>
  <products>
    <product>
      <name>${escapedPackageName}</name>
      <code>${escapedPackageCode}</code>
      <price>${totalPriceInCurrency}</price>
      <measuringUnitName>buc</measuringUnitName>
      <quantity>1</quantity>
      <isService>true</isService>
      <taxName>Fara TVA</taxName>
      <taxPercentage>0</taxPercentage>
      <isDiscount>false</isDiscount>
    </product>
  </products>
</request>`;

    console.log('📋 SmartBill XML request body:', xmlBody);

    // Create proforma in SmartBill using the correct endpoint with XML
    console.log('🚀 Sending XML request to SmartBill API...');
    const smartbillResponse = await fetch('https://ws.smartbill.ro/SBORO/api/estimate', {
      method: 'POST',
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
        'Authorization': `Basic ${btoa(`${smartbillUsername}:${smartbillToken}`)}`
      },
      body: xmlBody
    });

    const responseText = await smartbillResponse.text();
    console.log('📄 SmartBill proforma response status:', smartbillResponse.status);
    console.log('📄 SmartBill proforma response:', responseText);

    if (!smartbillResponse.ok) {
      // Parse SmartBill XML error response for better error handling
      let errorMessage = `SmartBill proforma creation failed (${smartbillResponse.status}): ${responseText}`;
      
      // Try to extract error from XML
      const errorTextMatch = responseText.match(/<errorText[^>]*>([^<]+)<\/errorText>/i);
      if (errorTextMatch) {
        errorMessage = `SmartBill Error: ${errorTextMatch[1]}`;
      } else {
        const messageMatch = responseText.match(/<message[^>]*>([^<]+)<\/message>/i);
        if (messageMatch) {
          errorMessage = `SmartBill Error: ${messageMatch[1]}`;
        }
      }
      
      console.error('❌ SmartBill API Error:', errorMessage);
      throw new Error(errorMessage);
    }

    // Parse XML response
    const proformaResult = parseXmlResponse(responseText);
    console.log('✅ SmartBill proforma created successfully:', proformaResult);

    // Determine SmartBill payment status based on actual payment status
    let smartbillPaymentStatus = 'pending';
    if (isPaymentCompleted) {
      smartbillPaymentStatus = 'completed';
      console.log('💳 Setting SmartBill payment status to completed - payment already processed via', paymentProvider);
    }

    // Update order with proforma information and payment status
    const updateData = {
      smartbill_proforma_id: proformaResult.number || proformaResult.id,
      smartbill_proforma_status: 'created',
      smartbill_proforma_data: proformaResult,
      smartbill_payment_status: smartbillPaymentStatus,
      updated_at: new Date().toISOString()
    };

    // Include additional Stripe tracking data if available
    if (orderData.stripe_customer_id && !currentOrder.stripe_customer_id) {
      updateData.stripe_customer_id = orderData.stripe_customer_id;
    }

    if (orderData.stripe_payment_intent_id && !currentOrder.stripe_payment_intent_id) {
      updateData.stripe_payment_intent_id = orderData.stripe_payment_intent_id;
    }

    const { error: updateError } = await supabaseClient
      .from('orders')
      .update(updateData)
      .eq('id', orderData.id);

    if (updateError) {
      console.error('❌ Error updating order with proforma data:', updateError);
      throw updateError;
    }

    console.log('✅ SmartBill proforma created and order updated successfully:', {
      proformaId: proformaResult.number || proformaResult.id,
      orderId: orderData.id,
      paymentStatus: smartbillPaymentStatus,
      stripeCustomerId: orderData.stripe_customer_id
    });

    return new Response(JSON.stringify({
      success: true,
      proformaId: proformaResult.number || proformaResult.id,
      proformaData: proformaResult,
      orderId: orderData.id,
      smartbillPaymentStatus: smartbillPaymentStatus,
      paymentProvider: paymentProvider,
      duplicate: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Error in smartbill-create-proforma:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
