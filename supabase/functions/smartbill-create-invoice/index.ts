
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

interface SmartBillInvoiceData {
  companyVatCode: string;
  seriesName: string;
  client: {
    name: string;
    vatCode?: string;
    regCom?: string;
    address?: string;
    isTaxPayer: boolean;
    city?: string;
    county?: string;
    country: string;
    email?: string;
  };
  issueDate: string;
  dueDate: string;
  language: string;
  precision: number;
  currency: string;
  products: Array<{
    name: string;
    code?: string;
    isUom: boolean;
    qty: number;
    price: number;
    isService: boolean;
    saveToDb: boolean;
    productType: string;
    taxName: string;
    taxPercentage: number;
  }>;
  issuerName?: string;
  issuerCnp?: string;
  observations?: string;
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
        package_includes: orderData.package_includes,
        smartbill_payment_status: 'pending'
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
          status: 'confirmed',
          smartbill_payment_status: 'completed'
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

    // Get SmartBill credentials
    const smartBillUsername = Deno.env.get('SMARTBILL_USERNAME')
    const smartBillToken = Deno.env.get('SMARTBILL_TOKEN')
    const smartBillBaseUrl = Deno.env.get('SMARTBILL_BASE_URL') || 'https://ws.smartbill.ro'

    if (!smartBillUsername || !smartBillToken) {
      console.error('SmartBill credentials not configured')
      // Fallback to basic order creation
      return new Response(
        JSON.stringify({ 
          success: true, 
          orderId: savedOrder.id,
          message: 'Order created successfully - SmartBill credentials not configured'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Create SmartBill invoice
    const invoiceData: SmartBillInvoiceData = {
      companyVatCode: Deno.env.get('SMARTBILL_COMPANY_VAT') || '',
      seriesName: 'MUSICGIFT',
      client: {
        name: orderData.form_data.fullName || 'Customer',
        address: orderData.form_data.address || '',
        city: orderData.form_data.city || 'Bucharest',
        county: orderData.form_data.county || 'Bucharest',
        country: 'Romania',
        email: orderData.form_data.email || '',
        isTaxPayer: false
      },
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      language: 'RO',
      precision: 2,
      currency: orderData.currency || 'RON',
      products: [
        {
          name: `${orderData.package_name} - Cadou Musical Personalizat`,
          code: orderData.package_value || 'MUSICGIFT',
          isUom: false,
          qty: 1,
          price: orderData.total_price,
          isService: true,
          saveToDb: false,
          productType: 'Serviciu',
          taxName: 'Normala',
          taxPercentage: 19
        }
      ],
      observations: `Comandă cadou musical personalizat pentru ${orderData.form_data.recipientName || 'destinatar'}`
    }

    console.log('Creating SmartBill invoice with data:', invoiceData)

    // Create invoice via SmartBill API
    const smartBillAuth = btoa(`${smartBillUsername}:${smartBillToken}`)
    
    const invoiceResponse = await fetch(`${smartBillBaseUrl}/SBORO/api/invoice`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${smartBillAuth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(invoiceData)
    })

    const invoiceResult = await invoiceResponse.json()
    console.log('SmartBill invoice response:', invoiceResult)

    if (!invoiceResponse.ok) {
      throw new Error(`SmartBill API error: ${invoiceResult.errorText || 'Unknown error'}`)
    }

    // Extract invoice ID and generate payment URL
    const smartBillInvoiceId = invoiceResult.number || `INV-${Date.now()}`
    const paymentUrl = `${Deno.env.get('SITE_URL')}/payment-success?order=${savedOrder.id}&invoice=${smartBillInvoiceId}`

    // Update order with SmartBill details
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({ 
        smartbill_invoice_id: smartBillInvoiceId,
        smartbill_payment_url: paymentUrl,
        smartbill_invoice_data: invoiceResult,
        smartbill_payment_status: 'pending'
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
