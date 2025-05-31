
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

    console.log('Creating payment for order:', orderId, 'amount:', amount);

    // Call the deployed Node.js API on Vercel
    const apiResponse = await fetch('https://netopia-payment-api.vercel.app/api/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        amount,
        currency,
        customerEmail,
        customerName,
        description
      })
    });

    console.log('Node.js API response status:', apiResponse.status);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Node.js API Error:', errorText);
      throw new Error(`Payment API failed with status ${apiResponse.status}: ${errorText}`);
    }

    const apiResult = await apiResponse.json();
    console.log('Node.js API result:', apiResult);

    if (!apiResult.success) {
      throw new Error(apiResult.error || 'Failed to create payment session');
    }

    // Update order with payment information from Node.js API response
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        payment_status: 'pending',
        payment_url: apiResult.paymentUrl,
        netopia_order_id: apiResult.netopiaOrderId,
        payment_id: apiResult.netopiaOrderId,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Error updating order:', updateError)
      throw updateError
    }

    console.log('Order updated successfully, returning payment data')

    return new Response(
      JSON.stringify({ 
        success: true, 
        paymentUrl: apiResult.paymentUrl,
        formData: apiResult.formData,
        netopiaOrderId: apiResult.netopiaOrderId,
        signature: apiResult.signature
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
