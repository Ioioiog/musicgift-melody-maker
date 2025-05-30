
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  description: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { orderId, amount, currency = 'RON', customerEmail, customerName, description }: PaymentRequest = await req.json()

    // Get NETOPIA credentials from environment
    const netopiaMerchantId = Deno.env.get('NETOPIA_MERCHANT_ID')
    const netopiaApiKey = Deno.env.get('NETOPIA_API_KEY')
    const netopiaSignature = Deno.env.get('NETOPIA_SIGNATURE')
    const netopiaTestMode = Deno.env.get('NETOPIA_TEST_MODE') === 'true'

    if (!netopiaMerchantId || !netopiaApiKey || !netopiaSignature) {
      throw new Error('NETOPIA credentials not configured')
    }

    // Generate unique NETOPIA order ID
    const netopiaOrderId = `ORDER_${orderId}_${Date.now()}`

    // NETOPIA payment data
    const paymentData = {
      order: {
        ntpID: netopiaOrderId,
        posSignature: netopiaSignature,
        dateTime: new Date().toISOString(),
        description: description,
        orderID: orderId,
        amount: amount,
        currency: currency,
        billing: {
          email: customerEmail,
          firstName: customerName.split(' ')[0] || customerName,
          lastName: customerName.split(' ').slice(1).join(' ') || '',
        },
        shipping: {
          email: customerEmail,
          firstName: customerName.split(' ')[0] || customerName,
          lastName: customerName.split(' ').slice(1).join(' ') || '',
        }
      },
      config: {
        emailTemplate: netopiaTestMode ? 'default' : 'custom',
        emailSubject: 'Payment Confirmation',
        landing: 'none',
        notifyUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/netopia-webhook`,
        redirectUrl: `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/payment/success`,
        language: 'ro'
      }
    }

    // Create payment session with NETOPIA
    const netopiaUrl = netopiaTestMode 
      ? 'https://secure.sandbox.netopia-payments.com/payment/card'
      : 'https://secure.netopia-payments.com/payment/card'

    const netopiaResponse = await fetch(netopiaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${netopiaApiKey}`,
      },
      body: JSON.stringify(paymentData)
    })

    if (!netopiaResponse.ok) {
      const errorText = await netopiaResponse.text()
      console.error('NETOPIA API Error:', errorText)
      throw new Error(`NETOPIA API failed: ${netopiaResponse.status}`)
    }

    const netopiaResult = await netopiaResponse.json()
    const paymentUrl = netopiaResult.paymentURL || netopiaResult.payment_url

    if (!paymentUrl) {
      console.error('No payment URL in NETOPIA response:', netopiaResult)
      throw new Error('No payment URL received from NETOPIA')
    }

    // Update order with payment information
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        payment_status: 'pending',
        payment_url: paymentUrl,
        netopia_order_id: netopiaOrderId,
        payment_id: netopiaResult.paymentId || netopiaResult.payment_id
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Error updating order:', updateError)
      throw updateError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        paymentUrl,
        netopiaOrderId 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error creating NETOPIA payment:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to create payment session' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
