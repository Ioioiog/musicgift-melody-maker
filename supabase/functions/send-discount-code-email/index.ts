
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

    const { discountCodeId, customerEmail, customerName } = await req.json()

    // Get discount code details
    const { data: discountCode, error: discountError } = await supabaseClient
      .from('discount_codes')
      .select('*')
      .eq('id', discountCodeId)
      .single()

    if (discountError || !discountCode) {
      throw new Error('Discount code not found')
    }

    // Check if discount code is active
    if (!discountCode.is_active) {
      throw new Error('Discount code is not active')
    }

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
          <title>Your Exclusive Discount Code!</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
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
              <h1>🎵 Exclusive Discount Just for You! 🎵</h1>
              <p>Your special discount code is ready to use</p>
            </div>
            
            <div class="content">
              <h2>Hello ${customerName}!</h2>
              
              <p>We're excited to offer you an exclusive discount on your next personalized song!</p>
              
              <div class="discount-card">
                <h3>💳 Your Discount Code</h3>
                <div class="amount">${discountAmount} OFF</div>
                <div class="code">${discountCode.code}</div>
                <p>Use this code at checkout to save on your order</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${redemptionUrl}" class="btn">Create Your Song Now</a>
              </div>
              
              <h3>How to use your discount:</h3>
              <ol>
                <li>Click "Create Your Song Now" above or visit our order page</li>
                <li>Choose your preferred music package</li>
                <li>At checkout, enter your discount code: <strong>${discountCode.code}</strong></li>
                <li>Enjoy your savings and your personalized song!</li>
              </ol>
              
              <p><strong>Code expires:</strong> ${expiryDate}</p>
              ${discountCode.minimum_order_amount > 0 ? `<p><strong>Minimum order:</strong> ${discountCode.minimum_order_amount / 100} RON</p>` : ''}
              ${discountCode.usage_limit ? `<p><strong>Uses remaining:</strong> ${discountCode.usage_limit - discountCode.used_count}</p>` : ''}
            </div>
            
            <div class="footer">
              <p>This discount code was sent from MusicGift</p>
              <p>If you have any questions, please contact our support team</p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
      Your Exclusive Discount Code!
      
      Hello ${customerName}!
      
      We're excited to offer you an exclusive discount: ${discountAmount} OFF your next personalized song!
      
      Discount Code: ${discountCode.code}
      
      To use your discount:
      1. Visit: ${redemptionUrl}
      2. Choose your music package
      3. Enter code: ${discountCode.code} at checkout
      4. Enjoy your savings!
      
      Code expires: ${expiryDate}
      ${discountCode.minimum_order_amount > 0 ? `Minimum order: ${discountCode.minimum_order_amount / 100} RON` : ''}
      
      Thank you for choosing MusicGift!
    `

    // Send email via Brevo
    const emailData = {
      sender: {
        name: "MusicGift",
        email: "discounts@musicgift.com"
      },
      to: [{
        email: customerEmail,
        name: customerName
      }],
      subject: `🎵 ${discountAmount} OFF Your Next Song - Code: ${discountCode.code}`,
      htmlContent: emailHtml,
      textContent: emailText,
      tags: ["discount-code", "manual-send"]
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

    console.log(`Discount code email sent successfully to ${customerEmail}`)

    return new Response(
      JSON.stringify({ success: true, message: 'Discount code email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Discount code email error:', error)
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
