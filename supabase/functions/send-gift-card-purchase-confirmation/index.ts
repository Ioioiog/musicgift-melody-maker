
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PurchaseConfirmationRequest {
  giftCardId: string;
  purchaserEmail: string;
  purchaserName: string;
  recipientName: string;
  recipientEmail: string;
  amount: number;
  currency: string;
  deliveryDate?: string;
  personalMessage?: string;
  designName?: string;
}

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
      purchaserEmail,
      purchaserName,
      recipientName,
      recipientEmail,
      amount,
      currency,
      deliveryDate,
      personalMessage,
      designName
    }: PurchaseConfirmationRequest = await req.json();

    console.log('Sending gift card purchase confirmation to:', purchaserEmail);

    // Format delivery date
    const deliveryText = deliveryDate 
      ? new Date(deliveryDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : 'Immediately';

    const emailSubject = `Gift Card Purchase Confirmation - ${amount} ${currency}`;
    const emailMessage = `
Gift Card Purchase Confirmation

Dear ${purchaserName},

Thank you for purchasing a gift card from MusicGift! Your purchase has been confirmed and processed successfully.

Purchase Details:
Gift Card Amount: ${amount} ${currency}
Gift Card ID: ${giftCardId.slice(0, 8)}...
Purchase Date: ${new Date().toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}

Recipient Information:
Name: ${recipientName}
Email: ${recipientEmail}
Delivery Date: ${deliveryText}

${designName ? `Selected Design: ${designName}` : ''}

${personalMessage ? `Your Personal Message:
"${personalMessage}"` : ''}

What happens next:
- Your gift card will be delivered to ${recipientEmail} on ${deliveryText}
- The recipient will receive an email with the gift card code and redemption instructions
- They can use the gift card to purchase any of our music packages
- You will receive a payment confirmation separately once the payment is processed

If you have any questions about your purchase, please don't hesitate to contact us at info@musicgift.ro.

Thank you for choosing MusicGift to share the gift of music!

Best regards,
The MusicGift Team

---
This is an automated confirmation email. Please do not reply to this email.
For support, contact us at info@musicgift.ro
    `.trim();

    // Send the purchase confirmation email
    const { data: emailData, error: emailError } = await supabase.functions.invoke('send-contact-email', {
      body: {
        firstName: 'Gift Card',
        lastName: 'Purchase',
        email: purchaserEmail,
        subject: emailSubject,
        message: emailMessage
      }
    });

    if (emailError) {
      console.error('Error sending purchase confirmation email:', emailError);
      throw new Error(`Failed to send purchase confirmation: ${emailError.message}`);
    }

    console.log('Purchase confirmation email sent successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Purchase confirmation email sent successfully',
        emailData 
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
    console.error('Error in send-gift-card-purchase-confirmation function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to send purchase confirmation email'
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
