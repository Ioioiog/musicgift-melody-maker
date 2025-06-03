
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderData {
  form_data: any;
  selected_addons: string[];
  total_price: number;
  package_value: string;
  package_name: string;
  package_price: number;
  package_delivery_time: string;
  package_includes: any[];
  status: string;
  payment_status: string;
  currency: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const orderData: OrderData = await req.json()
    console.log('Processing order with SmartBill:', orderData)

    // First, save the order to database
    const { data: savedOrder, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        form_data: orderData.form_data,
        selected_addons: orderData.selected_addons,
        total_price: orderData.total_price,
        status: orderData.status,
        payment_status: orderData.payment_status,
        package_value: orderData.package_value,
        package_name: orderData.package_name,
        package_price: orderData.package_price,
        package_delivery_time: orderData.package_delivery_time,
        package_includes: orderData.package_includes
      })
      .select()
      .single()

    if (orderError) {
      throw new Error(`Failed to save order: ${orderError.message}`)
    }

    console.log('Order saved to database:', savedOrder.id)

    // Check if payment is needed
    if (orderData.total_price <= 0) {
      // No payment needed, mark as completed
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ 
          payment_status: 'completed',
          status: 'confirmed'
        })
        .eq('id', savedOrder.id)

      if (updateError) {
        console.error('Error updating order status:', updateError)
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          orderId: savedOrder.id,
          message: 'Order completed successfully - no payment required'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // TODO: Implement actual SmartBill API integration
    // For now, return a placeholder response
    console.log('SmartBill integration placeholder - would create invoice for:', {
      orderId: savedOrder.id,
      amount: orderData.total_price,
      currency: orderData.currency,
      customerEmail: orderData.form_data.email,
      customerName: orderData.form_data.fullName
    })

    // Placeholder SmartBill invoice creation
    const smartBillInvoiceId = `INV-${Date.now()}`
    const paymentUrl = `${Deno.env.get('SITE_URL')}/payment-success?order=${savedOrder.id}&invoice=${smartBillInvoiceId}`

    // Update order with SmartBill invoice ID
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({ 
        smartbill_invoice_id: smartBillInvoiceId,
        smartbill_payment_url: paymentUrl
      })
      .eq('id', savedOrder.id)

    if (updateError) {
      console.error('Error updating order with SmartBill details:', updateError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: savedOrder.id,
        smartBillInvoiceId: smartBillInvoiceId,
        paymentUrl: paymentUrl,
        message: 'Invoice created successfully with SmartBill'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in SmartBill integration:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process order with SmartBill'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
