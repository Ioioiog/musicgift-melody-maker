
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
    const netopiaSignature = Deno.env.get('NETOPIA_SIGNATURE')
    const netopiaTestMode = Deno.env.get('NETOPIA_TEST_MODE') === 'true'
    const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:5173'

    console.log('NETOPIA credentials check:', {
      hasMerchantId: !!netopiaMerchantId,
      hasSignature: !!netopiaSignature,
      testMode: netopiaTestMode,
      siteUrl
    })

    if (!netopiaMerchantId || !netopiaSignature) {
      throw new Error('NETOPIA credentials not configured - missing NETOPIA_MERCHANT_ID or NETOPIA_SIGNATURE')
    }

    // Generate unique order ID for NETOPIA
    const netopiaOrderId = `ORDER_${orderId}_${Date.now()}`
    const timestamp = Date.now()

    // Split customer name into first and last name
    const nameParts = customerName.split(' ')
    const firstName = nameParts[0] || customerName
    const lastName = nameParts.slice(1).join(' ') || 'Customer'

    // NETOPIA payment data structure according to documentation
    const paymentData = {
      order: {
        $: {
          id: netopiaOrderId,
          timestamp: timestamp,
          type: "card",
        },
        signature: netopiaSignature,
        url: {
          return: `${siteUrl}/payment/success?orderId=${orderId}`,
          confirm: `${Deno.env.get('SUPABASE_URL')}/functions/v1/netopia-webhook`,
        },
        invoice: {
          $: {
            currency: currency,
            amount: amount,
          },
          details: description,
          contact_info: {
            billing: {
              $: {
                type: "person",
              },
              first_name: firstName,
              last_name: lastName,
              address: "Address",
              email: customerEmail,
              mobile_phone: "0000000000",
            },
            shipping: {
              $: {
                type: "person",
              },
              first_name: firstName,
              last_name: lastName,
              address: "Address", 
              email: customerEmail,
              mobile_phone: "0000000000",
            },
          },
        },
        ipn_cipher: "aes-256-cbc",
      },
    }

    console.log('Payment data to send to NETOPIA:', JSON.stringify(paymentData, null, 2))

    // Use correct NETOPIA API endpoint
    const netopiaUrl = netopiaTestMode 
      ? 'https://sandboxsecure.mobilpay.ro'
      : 'https://secure.mobilpay.ro'

    console.log('Making request to NETOPIA URL:', netopiaUrl)

    const netopiaResponse = await fetch(netopiaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    })

    console.log('NETOPIA response status:', netopiaResponse.status)
    console.log('NETOPIA response headers:', Object.fromEntries(netopiaResponse.headers.entries()))

    if (!netopiaResponse.ok) {
      const errorText = await netopiaResponse.text()
      console.error('NETOPIA API Error Response:', errorText)
      throw new Error(`NETOPIA API failed with status ${netopiaResponse.status}: ${errorText}`)
    }

    const netopiaResult = await netopiaResponse.text() // NETOPIA might return HTML or text instead of JSON
    console.log('NETOPIA result:', netopiaResult)

    // For now, we'll construct a payment URL since NETOPIA documentation doesn't specify the exact response format
    // This might need adjustment based on actual NETOPIA response
    const paymentUrl = `${netopiaUrl}?data=${encodeURIComponent(JSON.stringify(paymentData))}`

    // Update order with payment information
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        payment_status: 'pending',
        payment_url: paymentUrl,
        netopia_order_id: netopiaOrderId,
        payment_id: netopiaOrderId
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Error updating order:', updateError)
      throw updateError
    }

    console.log('Order updated successfully, returning payment URL')

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
