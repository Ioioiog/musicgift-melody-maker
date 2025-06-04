
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
  gift_card_id?: string;
  is_gift_redemption?: boolean;
  gift_credit_applied?: number;
  user_id?: string;
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
    saveToDb?: boolean;
  };
  issueDate: string;
  dueDate: string;
  deliveryDate: string;
  isDraft: boolean;
  language: string;
  sendEmail: boolean;
  precision: number;
  currency: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
    measuringUnitName: string;
    currency: string;
    isTaxIncluded: boolean;
    taxName: string;
    taxPercentage: number;
    isDiscount: boolean;
    saveToDb: boolean;
    isService: boolean;
  }>;
  observations?: string;
}

const validateSmartBillConfig = () => {
  const username = Deno.env.get('SMARTBILL_USERNAME')
  const token = Deno.env.get('SMARTBILL_TOKEN')
  const baseUrl = Deno.env.get('SMARTBILL_BASE_URL') || 'https://ws.smartbill.ro'
  const companyVat = Deno.env.get('SMARTBILL_COMPANY_VAT')
  const seriesName = Deno.env.get('SMARTBILL_SERIES') || 'mng'
  
  console.log('SmartBill Config Check:', {
    username: username ? '***configured***' : 'MISSING',
    token: token ? '***configured***' : 'MISSING',
    baseUrl,
    companyVat: companyVat ? '***configured***' : 'MISSING',
    seriesName
  })
  
  return { username, token, baseUrl, companyVat, seriesName }
}

const handleSmartBillResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type') || ''
  console.log('SmartBill Response Status:', response.status)
  console.log('SmartBill Response Content-Type:', contentType)
  
  // Get response as text first to inspect it
  const responseText = await response.text()
  console.log('SmartBill Raw Response (first 500 chars):', responseText.substring(0, 500))
  
  // Check if response is HTML (error page)
  if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
    console.error('SmartBill returned HTML error page instead of JSON')
    throw new Error(`SmartBill API returned HTML error page. Status: ${response.status}`)
  }
  
  // Try to parse as JSON
  try {
    const jsonResult = JSON.parse(responseText)
    console.log('SmartBill JSON Response:', jsonResult)
    return jsonResult
  } catch (parseError) {
    console.error('Failed to parse SmartBill response as JSON:', parseError)
    console.error('Response text:', responseText)
    throw new Error(`SmartBill API returned invalid JSON. Response: ${responseText.substring(0, 200)}...`)
  }
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
        currency: orderData.currency,
        user_id: orderData.user_id,
        gift_card_id: orderData.gift_card_id,
        is_gift_redemption: orderData.is_gift_redemption,
        gift_credit_applied: orderData.gift_credit_applied,
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

    // Validate SmartBill configuration
    const { username, token, baseUrl, companyVat, seriesName } = validateSmartBillConfig()

    if (!username || !token) {
      console.warn('SmartBill credentials not configured - creating order without invoice')
      
      // Update order with fallback status
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ 
          smartbill_payment_status: 'config_missing',
          smartbill_error: 'SmartBill credentials not configured'
        })
        .eq('id', savedOrder.id)

      if (updateError) {
        console.error('Error updating order with fallback status:', updateError)
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          orderId: savedOrder.id,
          message: 'Order created successfully - invoice will be generated manually',
          warning: 'SmartBill integration not configured'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Calculate dates
    const issueDate = new Date().toISOString().split('T')[0]
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Create SmartBill invoice data using the simplified structure from your example
    const invoiceData: SmartBillInvoiceData = {
      companyVatCode: companyVat || '',
      seriesName: seriesName,
      client: {
        name: orderData.form_data.fullName || 'Customer',
        vatCode: '-',
        address: orderData.form_data.address || '-',
        city: orderData.form_data.city || 'Bucuresti - Sector 3',
        county: orderData.form_data.county || 'Bucuresti',
        country: 'Romania',
        email: orderData.form_data.email || '',
        isTaxPayer: false,
        saveToDb: false
      },
      issueDate: issueDate,
      dueDate: dueDate,
      deliveryDate: dueDate,
      isDraft: false,
      language: 'RO',
      sendEmail: true,
      precision: 2,
      currency: orderData.currency || 'RON',
      paymentUrl: 'Generate URL',
      products: [
        {
          name: `${orderData.package_name} - Cadou Musical Personalizat`,
          quantity: 1,
          price: orderData.total_price,
          measuringUnitName: 'buc',
          currency: orderData.currency || 'RON',
          isTaxIncluded: true,
          taxName: 'Normala',
          taxPercentage: 19,
          isDiscount: false,
          saveToDb: false,
          isService: true
        }
      ],
      observations: `Comandă cadou musical personalizat pentru ${orderData.form_data.recipientName || 'destinatar'}`
    }

    console.log('Creating SmartBill invoice with data:', invoiceData)

    // Create invoice via SmartBill API with the authentication format from your example
    const smartBillAuth = btoa(`${username}:${token}`)
    
    let invoiceResponse: Response
    let invoiceResult: any
    
    try {
      console.log('Sending request to SmartBill API:', `${baseUrl}/SBORO/api/invoice`)
      
      invoiceResponse = await fetch(`${baseUrl}/SBORO/api/invoice`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${smartBillAuth}`
        },
        body: JSON.stringify(invoiceData)
      })
      
      invoiceResult = await handleSmartBillResponse(invoiceResponse)
      
    } catch (smartBillError) {
      console.error('SmartBill API Error:', smartBillError)
      
      // Update order with error status but don't fail the order
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ 
          smartbill_payment_status: 'failed',
          smartbill_error: smartBillError.message
        })
        .eq('id', savedOrder.id)

      if (updateError) {
        console.error('Error updating order with SmartBill error:', updateError)
      }

      // Return success with manual invoice note
      return new Response(
        JSON.stringify({
          success: true,
          orderId: savedOrder.id,
          message: 'Order created successfully - invoice will be generated manually',
          warning: 'SmartBill integration temporarily unavailable'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Check if SmartBill returned an error - using the structure from your example
    if (!invoiceResponse.ok || invoiceResult?.sbcResponse?.errorText || invoiceResult?.error) {
      const errorMessage = invoiceResult?.sbcResponse?.errorText || invoiceResult?.error || `HTTP ${invoiceResponse.status}`
      console.error('SmartBill API returned error:', errorMessage)
      
      // Update order with error status
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ 
          smartbill_payment_status: 'failed',
          smartbill_error: errorMessage
        })
        .eq('id', savedOrder.id)

      if (updateError) {
        console.error('Error updating order with SmartBill error:', updateError)
      }

      return new Response(
        JSON.stringify({
          success: true,
          orderId: savedOrder.id,
          message: 'Order created successfully - invoice will be generated manually',
          warning: `SmartBill error: ${errorMessage}`
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Success - extract invoice details using the response structure from your example
    const smartBillInvoiceId = invoiceResult?.sbcResponse?.number || invoiceResult?.invoiceNumber || `INV-${Date.now()}`
    const smartBillPaymentUrl = invoiceResult?.sbcResponse?.url || invoiceResult?.paymentUrl
    
    // Use SmartBill's payment URL if available, otherwise redirect to success page
    const finalPaymentUrl = smartBillPaymentUrl || `${Deno.env.get('SITE_URL')}/payment/success?orderId=${savedOrder.id}&invoice=${smartBillInvoiceId}`

    console.log('SmartBill invoice created successfully:', {
      invoiceId: smartBillInvoiceId,
      paymentUrl: smartBillPaymentUrl,
      finalUrl: finalPaymentUrl
    })

    // Update order with SmartBill details
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({ 
        smartbill_invoice_id: smartBillInvoiceId,
        smartbill_payment_url: finalPaymentUrl,
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
        paymentUrl: finalPaymentUrl,
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
