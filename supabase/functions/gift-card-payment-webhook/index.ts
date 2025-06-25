
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      giftCardId, 
      paymentStatus, 
      paymentProvider,
      transactionDetails 
    } = await req.json();

    console.log('Processing gift card payment webhook:', {
      giftCardId,
      paymentStatus,
      paymentProvider
    });

    // Update gift card payment status
    const { data: giftCard, error: updateError } = await supabase
      .from('gift_cards')
      .update({ 
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', giftCardId)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating gift card:', updateError);
      throw new Error(`Failed to update gift card: ${updateError.message}`);
    }

    console.log('Gift card updated successfully:', giftCard.id);

    // Only proceed with email sending if payment was successful
    if (paymentStatus === 'completed' || paymentStatus === 'paid') {
      console.log('Payment successful, processing gift card delivery');
      
      // Verify gift card data is complete before sending emails
      if (!giftCard.code || giftCard.code.startsWith('TEMP-')) {
        console.error('Gift card has invalid code, skipping email delivery:', giftCard.code);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Gift card has invalid code',
            giftCardId: giftCard.id 
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      try {
        // Send gift card email to recipient
        console.log('Sending gift card email to recipient:', giftCard.recipient_email);
        const { error: giftEmailError } = await supabase.functions.invoke('send-gift-card-email', {
          body: {
            giftCardId: giftCard.id,
            recipientEmail: giftCard.recipient_email,
            recipientName: giftCard.recipient_name,
            senderName: giftCard.sender_name,
            amount: giftCard.gift_amount,
            currency: giftCard.currency || 'RON',
            personalMessage: giftCard.message_text,
            giftCardCode: giftCard.code
          }
        });

        if (giftEmailError) {
          console.error('Error sending gift card email:', giftEmailError);
        } else {
          console.log('Gift card email sent successfully to recipient');
        }

        // Send final confirmation email to purchaser
        console.log('Sending purchase confirmation email to purchaser:', giftCard.sender_email);
        const { error: confirmationError } = await supabase.functions.invoke('send-gift-card-purchase-confirmation', {
          body: {
            giftCardId: giftCard.id,
            purchaserEmail: giftCard.sender_email,
            purchaserName: giftCard.sender_name,
            recipientName: giftCard.recipient_name,
            recipientEmail: giftCard.recipient_email,
            amount: giftCard.gift_amount,
            currency: giftCard.currency || 'RON',
            deliveryDate: giftCard.delivery_date,
            personalMessage: giftCard.message_text,
            giftCardCode: giftCard.code,
            designName: null // We can enhance this later to fetch design name
          }
        });

        if (confirmationError) {
          console.error('Error sending purchase confirmation email:', confirmationError);
        } else {
          console.log('Purchase confirmation email sent successfully to buyer');
        }

      } catch (emailError) {
        console.error('Error sending emails after successful payment:', emailError);
        // Don't throw - the payment was successful, email failures shouldn't block the webhook
      }
    } else {
      console.log('Payment not successful, skipping email delivery. Status:', paymentStatus);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Gift card payment webhook processed successfully',
        giftCardId: giftCard.id,
        paymentStatus,
        emailsTriggered: paymentStatus === 'completed' || paymentStatus === 'paid'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in gift card payment webhook:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to process gift card payment webhook'
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
