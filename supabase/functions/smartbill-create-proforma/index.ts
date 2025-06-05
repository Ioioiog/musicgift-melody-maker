
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderData {
  form_data: any;
  selected_addons: string[];
  total_price: number;
  package_value: string;
  package_name: string;
  package_price: number;
  package_delivery_time: string;
  package_includes: any[];
  status: string;
  payment_status: string;
  currency: string;
  user_id?: string;
  gift_card_id?: string;
  is_gift_redemption?: boolean;
  gift_credit_applied?: number;
}

// Helper function to escape XML special characters
function escapeXml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function convertEstimateDataToXML(data: any): string {
  const productXML = data.products.map((p: any) => `
    <product>
      <name>${escapeXml(p.name)}</name>
      <quantity>${p.quantity}</quantity>
      <price>${p.price}</price>
      <currency>${p.currency}</currency>
      <measuringUnitName>${p.measuringUnitName}</measuringUnitName>
      <isTaxIncluded>${p.isTaxIncluded}</isTaxIncluded>
      <taxName>${p.taxName}</taxName>
      <taxPercentage>${p.taxPercentage}</taxPercentage>
      <isService>${p.isService}</isService>
    </product>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<estimate>
  <companyVatCode>${data.companyVatCode}</companyVatCode>
  <seriesName>${data.seriesName}</seriesName>
  <client>
    <name>${escapeXml(data.client.name)}</name>
    <country>${data.client.country}</country>
    <isTaxPayer>${data.client.isTaxPayer}</isTaxPayer>
    <email>${escapeXml(data.client.email || '')}</email>
  </client>
  <issueDate>${data.issueDate}</issueDate>
  <dueDate>${data.dueDate}</dueDate>
  <deliveryDate>${data.deliveryDate}</deliveryDate>
  <isDraft>${data.isDraft}</isDraft>
  <language>${data.language}</language>
  <sendEmail>${data.sendEmail}</sendEmail>
  <precision>${data.precision}</precision>
  <currency>${data.currency}</currency>
  <products>${productXML}</products>
  <observations>${escapeXml(data.observations || '')}</observations>
</estimate>`
}

// Helper function to parse XML response
function parseXmlResponse(xmlText: string): any {
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
    const customerName = formData.fullName || formData.customerName || 'N/A';
    const customerEmail = formData.email || '';

    // Calculate dates
    const issueDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 7 days from now

    // Determine payment status context
    const isPaymentCompleted = orderData.payment_completed_via || orderData.payment_status === 'completed';
    const paymentProvider = orderData.payment_completed_via || orderData.payment_provider || 'online';
    
    console.log('💳 Payment context - Completed via:', paymentProvider, 'Status:', orderData.payment_status);

    // Convert total_price from cents to currency units
    const totalPriceInCurrency = orderData.total_price ? (orderData.total_price / 100) : 0;
    console.log('💰 Price conversion:', orderData.total_price, 'cents ->', totalPriceInCurrency, orderData.currency || 'RON');

    // Prepare client data
    const client = {
      name: customerName,
      country: 'Romania',
      email: customerEmail,
      isTaxPayer: true
    };

    // Enhanced observations with payment tracking information
    let observations = `Comanda #${orderData.id?.slice(0, 8)} - Cadou muzical personalizat. Pachet: ${orderData.package_name || orderData.package_value}`;
    
    if (isPaymentCompleted) {
      observations += ` | Plată finalizată prin ${paymentProvider.toUpperCase()}`;
      
      // Add Stripe-specific payment details
      if (paymentProvider === 'stripe' && orderData.stripe_payment_intent_id) {
        observations += ` (${orderData.stripe_payment_intent_id.slice(0, 16)}...)`;
      }
    }

    // Prepare estimate data using the working structure
    const estimate = {
      companyVatCode: smartbillCompanyVAT,
      seriesName: 'mng',
      client,
      issueDate,
      dueDate,
      deliveryDate: dueDate,
      isDraft: false,
      language: 'RO',
      sendEmail: true,
      precision: 2,
      currency: orderData.currency || 'RON',
      products: [{
        name: `${orderData.package_name || orderData.package_value} - Cadou Muzical`,
        quantity: 1,
        price: totalPriceInCurrency,
        measuringUnitName: 'buc',
        currency: orderData.currency || 'RON',
        isTaxIncluded: true,
        taxName: 'Normala',
        taxPercentage: 19,
        isService: true
      }],
      observations: observations
    };

    // Build XML request body using the working function
    const xmlBody = convertEstimateDataToXML(estimate);

    console.log('📋 SmartBill XML request body (using working structure):', xmlBody);

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
