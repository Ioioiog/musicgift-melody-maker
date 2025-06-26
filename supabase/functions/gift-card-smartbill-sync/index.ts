import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SmartBillEstimateInvoicesResponse {
  areInvoicesCreated: boolean;
  invoices?: Array<{
    number: string;
    series: string;
  }>;
  errorText?: string;
  message?: string;
}

interface SmartBillPaymentStatusResponse {
  errorText?: string;
  message?: string;
  number: string;
  series: string;
  invoiceTotalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
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

    const { giftCardId } = await req.json();
    
    if (!giftCardId) {
      return new Response(
        JSON.stringify({ error: 'Gift card ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Syncing SmartBill status for gift card: ${giftCardId}`);

    // Get the gift card with SmartBill proforma data
    const { data: giftCard, error: giftCardError } = await supabase
      .from('gift_cards')
      .select('id, code, smartbill_proforma_id, payment_status, sender_email, sender_name, recipient_email, recipient_name, gift_amount, currency, delivery_date, message_text')
      .eq('id', giftCardId)
      .single();

    if (giftCardError || !giftCard) {
      console.error('Gift card not found:', giftCardError);
      return new Response(
        JSON.stringify({ error: 'Gift card not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!giftCard.smartbill_proforma_id) {
      console.log('Gift card has no SmartBill proforma ID');
      return new Response(
        JSON.stringify({ 
          error: 'Gift card has no SmartBill proforma data',
          currentStatus: giftCard.payment_status 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract series and number from proforma ID (format: STRP0047)
    const proformaId = giftCard.smartbill_proforma_id;
    const seriesMatch = proformaId.match(/^([A-Z]+)/);
    const numberMatch = proformaId.match(/(\d+)$/);
    
    const proformaSeries = seriesMatch?.[1] || 'STRP';
    // Keep the original number format with leading zeros (e.g., "0055")
    const proformaNumber = numberMatch?.[1] || proformaId;

    console.log(`Checking proforma - Series: "${proformaSeries}", Number: "${proformaNumber}" (keeping original format with leading zeros)`);

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
    
    // Step 1: Check if proforma has been invoiced
    // Using lowercase 'seriesname' parameter as specified in the SmartBill documentation
    const estimateInvoicesUrl = `https://ws.smartbill.ro/SBORO/api/estimate/invoices?cif=${smartbillCompanyVat}&seriesname=${encodeURIComponent(proformaSeries)}&number=${encodeURIComponent(proformaNumber)}`;
    
    console.log(`Checking if proforma is invoiced: ${estimateInvoicesUrl}`);
    
    const estimateResponse = await fetch(estimateInvoicesUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${smartbillAuth}`,
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
    });

    if (!estimateResponse.ok) {
      console.error('SmartBill estimate API error:', estimateResponse.status, estimateResponse.statusText);
      const errorText = await estimateResponse.text();
      console.error('SmartBill error response:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to check SmartBill proforma status',
          details: `HTTP ${estimateResponse.status}: ${estimateResponse.statusText}`,
          smartbillError: errorText
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const estimateData: SmartBillEstimateInvoicesResponse = await estimateResponse.json();
    console.log('SmartBill estimate response:', estimateData);

    // Check for SmartBill errors
    if (estimateData.errorText) {
      console.error('SmartBill estimate API returned error:', estimateData.errorText);
      
      // If proforma not found or not invoiced, it means payment is still pending
      if (estimateData.errorText.includes('nu a fost facturata') || estimateData.errorText.includes('nu a fost gasita')) {
        return new Response(
          JSON.stringify({ 
            success: true,
            giftCardId,
            statusChanged: false,
            currentPaymentStatus: giftCard.payment_status,
            message: 'Proforma not yet invoiced - payment still pending'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'SmartBill API error',
          details: estimateData.errorText
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If proforma is not invoiced yet, payment is still pending
    if (!estimateData.areInvoicesCreated || !estimateData.invoices || estimateData.invoices.length === 0) {
      console.log('Proforma not yet invoiced - payment still pending');
      return new Response(
        JSON.stringify({ 
          success: true,
          giftCardId,
          statusChanged: false,
          currentPaymentStatus: giftCard.payment_status,
          message: 'Proforma not yet invoiced - payment still pending'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Check payment status of the generated invoice
    const invoice = estimateData.invoices[0]; // Take the first invoice
    console.log(`Checking payment status for invoice - Series: "${invoice.series}", Number: "${invoice.number}"`);

    const paymentStatusUrl = `https://ws.smartbill.ro/SBORO/api/invoice/paymentstatus?cif=${smartbillCompanyVat}&seriesname=${encodeURIComponent(invoice.series)}&number=${encodeURIComponent(invoice.number)}`;
    
    const paymentResponse = await fetch(paymentStatusUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${smartbillAuth}`,
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
    });

    if (!paymentResponse.ok) {
      console.error('SmartBill payment status API error:', paymentResponse.status, paymentResponse.statusText);
      const errorText = await paymentResponse.text();
      console.error('SmartBill payment error response:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to check SmartBill payment status',
          details: `HTTP ${paymentResponse.status}: ${paymentResponse.statusText}`,
          smartbillError: errorText
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const paymentData: SmartBillPaymentStatusResponse = await paymentResponse.json();
    console.log('SmartBill payment status response:', paymentData);

    // Check for SmartBill payment errors
    if (paymentData.errorText) {
      console.error('SmartBill payment API returned error:', paymentData.errorText);
      return new Response(
        JSON.stringify({ 
          error: 'SmartBill payment API error',
          details: paymentData.errorText
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine payment status based on SmartBill response
    let newPaymentStatus = giftCard.payment_status;
    let statusChanged = false;

    const { invoiceTotalAmount, paidAmount, unpaidAmount } = paymentData;
    
    console.log(`Payment details - Total: ${invoiceTotalAmount}, Paid: ${paidAmount}, Unpaid: ${unpaidAmount}`);

    // Update status based on payment amounts
    if (unpaidAmount === 0 && paidAmount === invoiceTotalAmount) {
      // Fully paid
      newPaymentStatus = 'completed';
      statusChanged = giftCard.payment_status !== 'completed';
    } else if (paidAmount > 0 && unpaidAmount > 0) {
      // Partially paid
      newPaymentStatus = 'partial';
      statusChanged = giftCard.payment_status !== 'partial';
    } else if (paidAmount === 0) {
      // Not paid yet
      newPaymentStatus = 'pending';
      statusChanged = giftCard.payment_status !== 'pending';
    }

    // Update the gift card status if changed
    if (statusChanged) {
      const updateData = {
        payment_status: newPaymentStatus,
        smartbill_proforma_status: newPaymentStatus,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('gift_cards')
        .update(updateData)
        .eq('id', giftCardId);

      if (updateError) {
        console.error('Error updating gift card:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update gift card status' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Gift card ${giftCardId} status updated to: ${newPaymentStatus}`);

      // If payment is completed, trigger email sending
      if (newPaymentStatus === 'completed') {
        console.log('🎉 Gift card payment completed - triggering email delivery');
        
        // Send gift card to recipient
        try {
          const { error: deliveryError } = await supabase.functions.invoke('send-gift-card-email', {
            body: { giftCardId: giftCardId }
          });

          if (deliveryError) {
            console.error('❌ Failed to send gift card delivery email:', deliveryError);
          } else {
            console.log('✅ Gift card delivery email sent successfully');
          }
        } catch (error) {
          console.error('❌ Error sending gift card delivery email:', error);
        }

        // Send purchase confirmation to buyer
        try {
          const { error: confirmationError } = await supabase.functions.invoke('send-gift-card-purchase-confirmation', {
            body: {
              giftCardId: giftCardId,
              purchaserEmail: giftCard.sender_email,
              purchaserName: giftCard.sender_name,
              recipientName: giftCard.recipient_name,
              recipientEmail: giftCard.recipient_email,
              amount: giftCard.gift_amount,
              currency: giftCard.currency,
              deliveryDate: giftCard.delivery_date,
              personalMessage: giftCard.message_text,
              designName: 'Selected Design'
            }
          });

          if (confirmationError) {
            console.error('❌ Failed to send purchase confirmation email:', confirmationError);
          } else {
            console.log('✅ Purchase confirmation email sent successfully');
          }
        } catch (error) {
          console.error('❌ Error sending purchase confirmation email:', error);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        giftCardId,
        statusChanged,
        currentPaymentStatus: newPaymentStatus,
        paymentDetails: {
          invoiceTotalAmount,
          paidAmount,
          unpaidAmount
        },
        invoiceDetails: {
          series: invoice.series,
          number: invoice.number
        },
        message: statusChanged 
          ? `Status updated successfully to ${newPaymentStatus}` 
          : 'Status checked - no changes needed'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in gift card SmartBill sync:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
