
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { giftCardId } = await req.json()

    // Get gift card details
    const { data: giftCard, error: giftError } = await supabaseClient
      .from('gift_cards')
      .select('*')
      .eq('id', giftCardId)
      .single()

    if (giftError || !giftCard) {
      throw new Error('Gift card not found')
    }

    // Check if gift card is active and payment completed
    if (giftCard.status !== 'active' || giftCard.payment_status !== 'completed') {
      throw new Error('Gift card is not ready for delivery')
    }

    // Create redemption URL
    const redemptionUrl = `${Deno.env.get('SITE_URL')}/gift?gift=${giftCard.code}`
    const giftAmount = (giftCard.gift_amount || 0) / 100

    // Prepare email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Musical Gift Awaits!</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .gift-card { background: white; border: 2px dashed #667eea; padding: 20px; margin: 20px 0; text-align: center; border-radius: 10px; }
            .code { font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px; margin: 10px 0; }
            .amount { font-size: 28px; font-weight: bold; color: #764ba2; }
            .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎵 Your Musical Gift Has Arrived! 🎵</h1>
              <p>Someone special has sent you a personalized song</p>
            </div>
            
            <div class="content">
              <h2>Hello ${giftCard.recipient_name}!</h2>
              
              <p><strong>${giftCard.sender_name}</strong> has sent you a special musical gift!</p>
              
              ${giftCard.message_text ? `
                <div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; font-style: italic;">
                  "${giftCard.message_text}"
                </div>
              ` : ''}
              
              <div class="gift-card">
                <h3>🎁 Gift Card Details</h3>
                <div class="amount">${giftAmount} RON</div>
                <div class="code">${giftCard.code}</div>
                <p>Use this code to create your personalized song</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${redemptionUrl}" class="btn">Redeem Your Gift Card</a>
              </div>
              
              <h3>How it works:</h3>
              <ol>
                <li>Click the "Redeem Your Gift Card" button above</li>
                <li>Enter your gift card code: <strong>${giftCard.code}</strong></li>
                <li>Choose your preferred music package</li>
                <li>Share your story and preferences</li>
                <li>Receive your personalized song within a few days</li>
              </ol>
              
              <p><strong>Your gift card expires on:</strong> ${new Date(giftCard.expires_at || '').toLocaleDateString()}</p>
            </div>
            
            <div class="footer">
              <p>This gift card was purchased through MusicGift</p>
              <p>If you have any questions, please contact our support team</p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
      Your Musical Gift Has Arrived!
      
      Hello ${giftCard.recipient_name}!
      
      ${giftCard.sender_name} has sent you a special musical gift worth ${giftAmount} RON!
      
      ${giftCard.message_text ? `Message: "${giftCard.message_text}"` : ''}
      
      Gift Card Code: ${giftCard.code}
      
      To redeem your gift card:
      1. Visit: ${redemptionUrl}
      2. Enter your code: ${giftCard.code}
      3. Choose your music package and share your story
      4. Receive your personalized song within a few days
      
      Your gift card expires on: ${new Date(giftCard.expires_at || '').toLocaleDateString()}
      
      Thank you for choosing MusicGift!
    `

    // Send email via Brevo
    const emailData = {
      sender: {
        name: "MusicGift",
        email: "gifts@musicgift.com"
      },
      to: [{
        email: giftCard.recipient_email,
        name: giftCard.recipient_name
      }],
      subject: `🎵 Musical Gift from ${giftCard.sender_name} - ${giftAmount} RON`,
      htmlContent: emailHtml,
      textContent: emailText,
      tags: ["gift-card", "delivery"]
    }

    const brevoResponse = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': Deno.env.get('BREVO_API_KEY') || ''
      },
      body: JSON.stringify(emailData)
    })

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.json()
      throw new Error(`Email delivery failed: ${errorData.message || 'Unknown error'}`)
    }

    console.log(`Gift card email sent successfully to ${giftCard.recipient_email}`)

    return new Response(
      JSON.stringify({ success: true, message: 'Gift card email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Gift card email error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
