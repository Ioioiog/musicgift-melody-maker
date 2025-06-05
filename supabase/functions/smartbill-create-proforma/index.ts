
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    console.log('Creating SmartBill proforma for order:', orderData.id);

    const smartbillUsername = Deno.env.get('SMARTBILL_USERNAME');
    const smartbillToken = Deno.env.get('SMARTBILL_TOKEN');
    const smartbillCompanyVAT = Deno.env.get('SMARTBILL_COMPANY_VAT');

    if (!smartbillUsername || !smartbillToken || !smartbillCompanyVAT) {
      throw new Error('Missing SmartBill credentials');
    }

    // Extract form data safely
    const formData = orderData.form_data || {};
    const customerName = formData.fullName || formData.customerName || 'N/A';
    const customerEmail = formData.email || '';
    const customerPhone = formData.phone || '';
    const customerAddress = formData.address || '';
    const customerCity = formData.city || '';
    const customerCounty = formData.county || '';

    // Calculate dates
    const issueDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 30 days from now

    // Prepare proforma data for SmartBill API according to documentation
    const proformaData = {
      companyVatCode: smartbillCompanyVAT, // Corrected parameter name
      client: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: customerAddress,
        city: customerCity,
        county: customerCounty,
        country: "Romania",
        isTaxPayer: false, // Individual person (not VAT payer)
        saveToDb: true // Save client to nomenclator
      },
      seriesName: "STRP", // Required series for proformas
      issueDate: issueDate,
      dueDate: dueDate,
      language: "RO", // Romanian language
      precision: 2,
      currency: orderData.currency || "RON",
      isDraft: false, // Final proforma, not draft
      mentions: `Comanda #${orderData.id?.slice(0, 8)} - Cadou muzical personalizat. Pachet: ${orderData.package_name || orderData.package_value}`,
      observations: `Plata efectuata prin ${orderData.payment_provider || 'online'}. Status: ${orderData.payment_status}`,
      products: [
        {
          name: `${orderData.package_name || orderData.package_value} - Pachet Cadou Muzical`,
          code: orderData.package_value || "MUSIC-GIFT",
          price: (orderData.total_price || 0) / 100, // Convert from cents to currency units
          measuringUnit: "buc",
          quantity: 1,
          productType: "Serviciu",
          taxName: "Fara TVA",
          taxPercentage: 0,
          isDiscount: false
        }
      ]
    };

    console.log('SmartBill proforma data:', JSON.stringify(proformaData, null, 2));

    // Create proforma in SmartBill using the correct endpoint
    const smartbillResponse = await fetch('https://ws.smartbill.ro/SBORO/api/estimate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${smartbillUsername}:${smartbillToken}`)}`
      },
      body: JSON.stringify(proformaData)
    });

    const responseText = await smartbillResponse.text();
    console.log('SmartBill proforma response status:', smartbillResponse.status);
    console.log('SmartBill proforma response:', responseText);

    if (!smartbillResponse.ok) {
      // Parse SmartBill error response for better error handling
      let errorMessage = `SmartBill proforma creation failed: ${responseText}`;
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.errorText) {
          errorMessage = `SmartBill Error: ${errorData.errorText}`;
        } else if (errorData.message) {
          errorMessage = `SmartBill Error: ${errorData.message}`;
        }
      } catch (parseError) {
        console.log('Could not parse SmartBill error response');
      }
      throw new Error(errorMessage);
    }

    const proformaResult = JSON.parse(responseText);
    console.log('SmartBill proforma created successfully:', proformaResult);

    // Update order with proforma information
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        smartbill_proforma_id: proformaResult.number || proformaResult.id,
        smartbill_proforma_status: 'created',
        smartbill_proforma_data: proformaResult,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderData.id);

    if (updateError) {
      console.error('Error updating order with proforma data:', updateError);
      throw updateError;
    }

    console.log('SmartBill proforma created and order updated successfully:', proformaResult.number || proformaResult.id);

    return new Response(JSON.stringify({
      success: true,
      proformaId: proformaResult.number || proformaResult.id,
      proformaData: proformaResult,
      orderId: orderData.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in smartbill-create-proforma:', error);
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
