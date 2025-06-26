
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

// Simple XML parser for SmartBill responses
function parseSmartBillXML(xmlText: string): any {
  try {
    // Check for error in XML - only treat non-empty error text as actual errors
    const errorMatch = xmlText.match(/<errorText>(.*?)<\/errorText>/);
    if (errorMatch && errorMatch[1].trim()) {
      return { errorText: errorMatch[1].trim() };
    }

    // Parse estimate invoices response
    if (xmlText.includes('<areInvoicesCreated>')) {
      const areInvoicesCreatedMatch = xmlText.match(/<areInvoicesCreated>(.*?)<\/areInvoicesCreated>/);
      const areInvoicesCreated = areInvoicesCreatedMatch?.[1] === 'true';
      
      // Extract invoices if they exist
      const invoices: Array<{number: string, series: string}> = [];
      const invoiceMatches = xmlText.matchAll(/<invoice>(.*?)<\/invoice>/gs);
      
      for (const invoiceMatch of invoiceMatches) {
        const invoiceXml = invoiceMatch[1];
        const numberMatch = invoiceXml.match(/<number>(.*?)<\/number>/);
        const seriesMatch = invoiceXml.match(/<series>(.*?)<\/series>/);
        
        if (numberMatch && seriesMatch) {
          invoices.push({
            number: numberMatch[1],
            series: seriesMatch[1]
          });
        }
      }
      
      return {
        areInvoicesCreated,
        invoices: invoices.length > 0 ? invoices : undefined
      };
    }

    // Parse payment status response
    if (xmlText.includes('<invoiceTotalAmount>')) {
      const numberMatch = xmlText.match(/<number>(.*?)<\/number>/);
      const seriesMatch = xmlText.match(/<series>(.*?)<\/series>/);
      const totalMatch = xmlText.match(/<invoiceTotalAmount>(.*?)<\/invoiceTotalAmount>/);
      const paidMatch = xmlText.match(/<paidAmount>(.*?)<\/paidAmount>/);
      const unpaidMatch = xmlText.match(/<unpaidAmount>(.*?)<\/unpaidAmount>/);
      
      return {
        number: numberMatch?.[1] || '',
        series: seriesMatch?.[1] || '',
        invoiceTotalAmount: parseFloat(totalMatch?.[1] || '0'),
        paidAmount: parseFloat(paidMatch?.[1] || '0'),
        unpaidAmount: parseFloat(unpaidMatch?.[1] || '0')
      };
    }

    // Default response if structure is unknown
    return { errorText: 'Unknown XML response format' };
  } catch (error) {
    console.error('XML parsing error:', error);
    return { errorText: 'Failed to parse XML response' };
  }
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

    const estimateXmlText = await estimateResponse.text();
    console.log('SmartBill estimate XML response:', estimateXmlText);
    const estimateData: SmartBillEstimateInvoicesResponse = parseSmartBillXML(estimateXmlText);
    console.log('Parsed estimate response:', estimateData);

    // Check for SmartBill errors - only treat non-empty error text as actual errors
    if (estimateData.errorText && estimateData.errorText.trim()) {
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

    // FIXED LOGIC: If proforma has been invoiced, payment is completed
    if (estimateData.areInvoicesCreated && estimateData.invoices && estimateData.invoices.length > 0) {
      console.log('🎉 Proforma has been invoiced - payment completed!');
      const invoice = estimateData.invoices[0];
      
      let statusChanged = false;
      let newPaymentStatus = 'completed';
      
      // Update status if not already completed
      if (giftCard.payment_status !== 'completed') {
        statusChanged = true;
        
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

        // Trigger email sending since payment is completed
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

      return new Response(
        JSON.stringify({
          success: true,
          giftCardId,
          statusChanged,
          currentPaymentStatus: newPaymentStatus,
          invoiceDetails: {
            series: invoice.series,
            number: invoice.number
          },
          message: statusChanged 
            ? `Payment completed! Invoice ${invoice.series}${invoice.number} created` 
            : `Payment already completed - Invoice ${invoice.series}${invoice.number}`
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // If proforma is not invoiced yet, payment is still pending
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
