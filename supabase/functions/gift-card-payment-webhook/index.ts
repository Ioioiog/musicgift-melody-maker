
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const paymentData = await req.json()
    console.log('Gift card payment webhook received:', paymentData)

    const { orderId, status, amount } = paymentData

    // Update gift card payment status
    let paymentStatus = 'pending'
    let giftStatus = 'pending'

    if (status === 'confirmed' || status === 'completed') {
      paymentStatus = 'completed'
      giftStatus = 'active'
    } else if (status === 'failed' || status === 'cancelled') {
      paymentStatus = 'failed'
      giftStatus = 'cancelled'
    }

    const { data: giftCard, error: updateError } = await supabaseClient
      .from('gift_cards')
      .update({
        payment_status: paymentStatus,
        status: giftStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    console.log(`Gift card ${orderId} updated to status: ${paymentStatus}`)

    // If payment successful, create proforma receipt and send email
    if (paymentStatus === 'completed' && giftCard) {
      console.log('Payment completed - creating proforma receipt and sending email')
      
      try {
        // Create proforma receipt after successful payment
        const proformaResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/create-gift-card-proforma`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
          },
          body: JSON.stringify({ giftCardId: giftCard.id })
        })

        if (!proformaResponse.ok) {
          console.error('Failed to create proforma receipt:', await proformaResponse.text())
        } else {
          console.log('✅ Proforma receipt created successfully')
        }
      } catch (proformaError) {
        console.error('Error creating proforma receipt:', proformaError)
        // Don't fail the webhook if proforma creation fails
      }

      try {
        // Send gift card email
        const emailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-gift-card-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
          },
          body: JSON.stringify({ giftCardId: giftCard.id })
        })

        if (!emailResponse.ok) {
          console.error('Failed to send gift card email:', await emailResponse.text())
        } else {
          console.log('✅ Gift card email sent successfully')
        }
      } catch (emailError) {
        console.error('Error sending gift card email:', emailError)
        // Don't fail the webhook if email sending fails
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Gift card webhook error:', error)
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
