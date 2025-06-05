
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
    console.log('📄 Creating SmartBill proforma for order:', orderData.id);

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
    const customerPhone = formData.phone || '';
    const customerAddress = formData.address || '';
    const customerCity = formData.city || '';
    const customerCounty = formData.county || '';

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

    // Prepare proforma data for SmartBill API according to documentation
    const proformaData = {
      companyVatCode: smartbillCompanyVAT,
      client: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: customerAddress,
        city: customerCity,
        county: customerCounty,
        country: "Romania",
        isTaxPayer: false,
        saveToDb: true
      },
      seriesName: "STRP",
      issueDate: issueDate,
      dueDate: dueDate,
      language: "RO",
      precision: 2,
      currency: orderData.currency || "RON",
      isDraft: false,
      mentions: `Comanda #${orderData.id?.slice(0, 8)} - Cadou muzical personalizat. Pachet: ${orderData.package_name || orderData.package_value}${isPaymentCompleted ? ` | Plată finalizată prin ${paymentProvider.toUpperCase()}` : ''}`,
      observations: `Plata ${isPaymentCompleted ? 'finalizată' : 'în procesare'} prin ${paymentProvider}. Status: ${orderData.payment_status}`,
      products: [
        {
          name: `${orderData.package_name || orderData.package_value} - Pachet Cadou Muzical`,
          code: orderData.package_value || "MUSIC-GIFT",
          price: totalPriceInCurrency,
          measuringUnit: "buc",
          quantity: 1,
          productType: "Serviciu",
          taxName: "Fara TVA",
          taxPercentage: 0,
          isDiscount: false
        }
      ]
    };

    console.log('📋 SmartBill proforma data:', JSON.stringify(proformaData, null, 2));

    // Create proforma in SmartBill using the correct endpoint
    console.log('🚀 Sending request to SmartBill API...');
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
    console.log('📄 SmartBill proforma response status:', smartbillResponse.status);
    console.log('📄 SmartBill proforma response:', responseText);

    if (!smartbillResponse.ok) {
      // Parse SmartBill error response for better error handling
      let errorMessage = `SmartBill proforma creation failed (${smartbillResponse.status}): ${responseText}`;
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.errorText) {
          errorMessage = `SmartBill Error: ${errorData.errorText}`;
        } else if (errorData.message) {
          errorMessage = `SmartBill Error: ${errorData.message}`;
        } else if (errorData.error) {
          errorMessage = `SmartBill Error: ${errorData.error}`;
        }
      } catch (parseError) {
        console.log('⚠️ Could not parse SmartBill error response');
      }
      
      console.error('❌ SmartBill API Error:', errorMessage);
      throw new Error(errorMessage);
    }

    const proformaResult = JSON.parse(responseText);
    console.log('✅ SmartBill proforma created successfully:', proformaResult);

    // Determine SmartBill payment status based on actual payment status
    let smartbillPaymentStatus = 'pending';
    if (isPaymentCompleted) {
      smartbillPaymentStatus = 'completed';
      console.log('💳 Setting SmartBill payment status to completed - payment already processed via', paymentProvider);
    }

    // Update order with proforma information and payment status
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        smartbill_proforma_id: proformaResult.number || proformaResult.id,
        smartbill_proforma_status: 'created',
        smartbill_proforma_data: proformaResult,
        smartbill_payment_status: smartbillPaymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderData.id);

    if (updateError) {
      console.error('❌ Error updating order with proforma data:', updateError);
      throw updateError;
    }

    console.log('✅ SmartBill proforma created and order updated successfully:', {
      proformaId: proformaResult.number || proformaResult.id,
      orderId: orderData.id,
      paymentStatus: smartbillPaymentStatus
    });

    return new Response(JSON.stringify({
      success: true,
      proformaId: proformaResult.number || proformaResult.id,
      proformaData: proformaResult,
      orderId: orderData.id,
      smartbillPaymentStatus: smartbillPaymentStatus
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
