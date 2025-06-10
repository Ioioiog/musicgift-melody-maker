
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

    const { orderId, discountCode, customerEmail, customerName } = await req.json()

    const discountAmount = discountCode.discount_type === 'percentage' 
      ? `${discountCode.discount_value}%` 
      : `${discountCode.discount_value / 100} RON`

    const expiryDate = discountCode.expires_at 
      ? new Date(discountCode.expires_at).toLocaleDateString() 
      : 'No expiry'

    const redemptionUrl = `${Deno.env.get('SITE_URL')}/order`

    // Prepare email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Thank You + Special Discount!</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .thank-you { background: #e8f5e8; border: 1px solid #4caf50; padding: 20px; margin: 20px 0; border-radius: 10px; text-align: center; }
            .discount-card { background: white; border: 2px dashed #667eea; padding: 20px; margin: 20px 0; text-align: center; border-radius: 10px; }
            .code { font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px; margin: 10px 0; }
            .amount { font-size: 28px; font-weight: bold; color: #764ba2; }
            .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎵 Thank You + Special Reward! 🎵</h1>
              <p>Your order is confirmed and here's something special for you</p>
            </div>
            
            <div class="content">
              <h2>Hello ${customerName}!</h2>
              
              <div class="thank-you">
                <h3>✅ Order Confirmed!</h3>
                <p>Thank you for choosing MusicGift! Your personalized song is being created with love.</p>
              </div>
              
              <p>As a thank you for your order, we're excited to give you a special discount for your next purchase!</p>
              
              <div class="discount-card">
                <h3>🎁 Your Reward Code</h3>
                <div class="amount">${discountAmount} OFF</div>
                <div class="code">${discountCode.code}</div>
                <p>Use this code for your next personalized song</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${redemptionUrl}" class="btn">Order Another Song</a>
              </div>
              
              <h3>Share the magic:</h3>
              <ul>
                <li>🎵 Perfect for birthdays, anniversaries, or special occasions</li>
                <li>💝 Give the gift of music to someone you love</li>
                <li>🎼 Each song is uniquely crafted just for you</li>
              </ul>
              
              <p><strong>Your discount expires:</strong> ${expiryDate}</p>
              ${discountCode.minimum_order_amount > 0 ? `<p><strong>Minimum order:</strong> ${discountCode.minimum_order_amount / 100} RON</p>` : ''}
            </div>
            
            <div class="footer">
              <p>This reward was automatically generated based on your recent order</p>
              <p>Thank you for being a valued MusicGift customer!</p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
      Thank You + Special Reward!
      
      Hello ${customerName}!
      
      ✅ Order Confirmed! Thank you for choosing MusicGift!
      
      As a thank you, here's a special discount for your next purchase: ${discountAmount} OFF
      
      Reward Code: ${discountCode.code}
      
      To use your reward:
      1. Visit: ${redemptionUrl}
      2. Choose your next music package
      3. Enter code: ${discountCode.code} at checkout
      
      Discount expires: ${expiryDate}
      ${discountCode.minimum_order_amount > 0 ? `Minimum order: ${discountCode.minimum_order_amount / 100} RON` : ''}
      
      Share the magic of personalized music with someone special!
      
      Thank you for being a valued MusicGift customer!
    `

    // Send email via Brevo
    const emailData = {
      sender: {
        name: "MusicGift",
        email: "mihai.gruia@mangorecords.net"
      },
      to: [{
        email: customerEmail,
        name: customerName
      }],
      subject: `🎵 Thank You + ${discountAmount} OFF Your Next Song!`,
      htmlContent: emailHtml,
      textContent: emailText,
      tags: ["auto-discount", "order-reward", "thank-you"]
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
      
      // Log failed email delivery
      await supabaseClient
        .from('discount_email_deliveries')
        .insert({
          discount_code_id: discountCode.id,
          discount_code: discountCode.code,
          recipient_email: customerEmail,
          recipient_name: customerName,
          email_type: 'auto_generated',
          delivery_status: 'failed',
          error_message: errorData.message || 'Unknown Brevo error'
        })

      throw new Error(`Email delivery failed: ${errorData.message || 'Unknown error'}`)
    }

    const brevoResult = await brevoResponse.json()

    // Log successful email delivery
    await supabaseClient
      .from('discount_email_deliveries')
      .insert({
        discount_code_id: discountCode.id,
        discount_code: discountCode.code,
        recipient_email: customerEmail,
        recipient_name: customerName,
        email_type: 'auto_generated',
        delivery_status: 'sent',
        brevo_message_id: brevoResult.messageId
      })

    console.log(`Auto-generated discount email sent successfully to ${customerEmail}`)

    return new Response(
      JSON.stringify({ success: true, message: 'Auto-discount email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Auto-discount email error:', error)
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
