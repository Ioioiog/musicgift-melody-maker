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
  payment_provider?: string;
}

interface RequestBody {
  orderData?: OrderData;
  returnUrl?: string;
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
  paymentUrl?: string;
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
  // Updated to expect email instead of username as per SmartBill documentation
  const email = Deno.env.get('SMARTBILL_EMAIL') || Deno.env.get('SMARTBILL_USERNAME')
  const token = Deno.env.get('SMARTBILL_TOKEN')
  const baseUrl = Deno.env.get('SMARTBILL_BASE_URL') || 'https://ws.smartbill.ro'
  const companyVat = Deno.env.get('SMARTBILL_COMPANY_VAT')
  const seriesName = Deno.env.get('SMARTBILL_SERIES') || 'mng'
  
  console.log('SmartBill Config Check:', {
    email: email ? '***configured***' : 'MISSING',
    emailFormat: email ? (email.includes('@') ? 'Valid email format' : 'NOT AN EMAIL - This may cause auth failure') : 'N/A',
    token: token ? '***configured***' : 'MISSING',
    baseUrl,
    companyVat: companyVat ? '***configured***' : 'MISSING',
    seriesName
  })
  
  // Validate email format
  if (email && !email.includes('@')) {
    console.warn('⚠️ SMARTBILL_EMAIL should be an email address, not a username. Current value does not contain @')
  }
  
  return { email, token, baseUrl, companyVat, seriesName }
}

const validateOrderData = (orderData: any): OrderData => {
  console.log('🔍 Validating order data structure:', JSON.stringify(orderData, null, 2))
  
  if (!orderData || typeof orderData !== 'object') {
    throw new Error('Order data is missing or invalid')
  }

  if (!orderData.form_data || typeof orderData.form_data !== 'object') {
    throw new Error('form_data is required and must be an object')
  }

  if (!orderData.form_data.fullName || typeof orderData.form_data.fullName !== 'string') {
    throw new Error('form_data.fullName is required')
  }

  if (!orderData.form_data.email || typeof orderData.form_data.email !== 'string') {
    throw new Error('form_data.email is required')
  }

  if (typeof orderData.total_price !== 'number' || orderData.total_price < 0) {
    throw new Error('total_price must be a valid positive number')
  }

  if (!orderData.package_name || typeof orderData.package_name !== 'string') {
    throw new Error('package_name is required')
  }

  if (!orderData.currency || typeof orderData.currency !== 'string') {
    throw new Error('currency is required')
  }

  console.log('✅ Order data validation passed')
  return orderData as OrderData
}

const handleSmartBillResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type') || ''
  console.log('SmartBill Response Status:', response.status)
  console.log('SmartBill Response Content-Type:', contentType)
  
  const responseText = await response.text()
  console.log('SmartBill Raw Response (first 500 chars):', responseText.substring(0, 500))
  
  if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
    console.error('SmartBill returned HTML error page instead of JSON')
    throw new Error(`SmartBill API returned HTML error page. Status: ${response.status}`)
  }
  
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse and validate request body structure
    const requestBody: RequestBody = await req.json()
    console.log('🔄 Raw request body:', JSON.stringify(requestBody, null, 2))

    // Extract orderData from the request structure
    let orderData: OrderData
    if (requestBody.orderData) {
      // New structure: { orderData: {...}, returnUrl?: "..." }
      orderData = requestBody.orderData
      console.log('📦 Using nested orderData structure')
    } else if (requestBody.form_data) {
      // Legacy structure: direct order data
      orderData = requestBody as OrderData
      console.log('📦 Using direct order data structure (legacy)')
    } else {
      throw new Error('Invalid request structure: orderData or form_data is required')
    }

    // Validate the extracted order data
    const validatedOrderData = validateOrderData(orderData)
    console.log('✅ Processing validated order:', {
      fullName: validatedOrderData.form_data.fullName,
      email: validatedOrderData.form_data.email,
      totalPrice: validatedOrderData.total_price,
      currency: validatedOrderData.currency,
      packageName: validatedOrderData.package_name
    })

    // Save order to database
    const { data: savedOrder, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        form_data: validatedOrderData.form_data,
        selected_addons: validatedOrderData.selected_addons || [],
        total_price: validatedOrderData.total_price,
        status: validatedOrderData.status || 'pending',
        payment_status: validatedOrderData.payment_status || 'pending',
        package_value: validatedOrderData.package_value,
        package_name: validatedOrderData.package_name,
        package_price: validatedOrderData.package_price || 0,
        package_delivery_time: validatedOrderData.package_delivery_time,
        package_includes: validatedOrderData.package_includes || [],
        currency: validatedOrderData.currency,
        user_id: validatedOrderData.user_id,
        gift_card_id: validatedOrderData.gift_card_id,
        is_gift_redemption: validatedOrderData.is_gift_redemption || false,
        gift_credit_applied: validatedOrderData.gift_credit_applied || 0,
        payment_provider: validatedOrderData.payment_provider || 'smartbill',
        smartbill_payment_status: 'pending'
      })
      .select()
      .single()

    if (orderError) {
      console.error('❌ Database error:', orderError)
      throw new Error(`Failed to save order: ${orderError.message}`)
    }

    console.log('✅ Order saved to database:', savedOrder.id)

    // Check if payment is needed
    const totalPriceInCents = typeof validatedOrderData.total_price === 'number' ? validatedOrderData.total_price : 0
    if (totalPriceInCents <= 0) {
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
    const { email, token, baseUrl, companyVat, seriesName } = validateSmartBillConfig()

    if (!email || !token) {
      console.warn('SmartBill credentials not configured - creating order without invoice')
      
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

    // Convert price from cents to RON (assuming total_price is in cents)
    const priceInRON = totalPriceInCents / 100
    console.log(`💰 Price conversion: ${totalPriceInCents} cents -> ${priceInRON} RON`)

    // Format address properly
    const clientAddress = validatedOrderData.form_data.address || 'Adresa nespecificata'
    const clientCity = validatedOrderData.form_data.city || 'Bucuresti'
    const clientCounty = validatedOrderData.form_data.county || 'Bucuresti'

    // Create SmartBill invoice data matching the documentation format exactly
    const invoiceData: SmartBillInvoiceData = {
      companyVatCode: companyVat || '',
      seriesName: seriesName,
      client: {
        name: validatedOrderData.form_data.fullName,
        vatCode: '',
        address: clientAddress,
        city: clientCity,
        county: clientCounty,
        country: 'Romania',
        email: validatedOrderData.form_data.email,
        isTaxPayer: false,
        saveToDb: false
      },
      issueDate: issueDate,
      dueDate: dueDate,
      deliveryDate: dueDate,
      isDraft: false, // Required field from documentation
      language: 'RO',
      sendEmail: true,
      precision: 2,
      currency: validatedOrderData.currency,
      paymentUrl: 'Generate URL', // Required field from documentation
      products: [
        {
          name: `${validatedOrderData.package_name} - Cadou Musical Personalizat`,
          quantity: 1,
          price: priceInRON,
          measuringUnitName: 'buc',
          currency: validatedOrderData.currency,
          isTaxIncluded: true,
          taxName: 'Redusa',
          taxPercentage: 9,
          isDiscount: false,
          saveToDb: false,
          isService: true
        }
      ],
      observations: `Comandă cadou musical personalizat pentru ${validatedOrderData.form_data.recipientName || 'destinatar'}`
    }

    console.log('📋 SmartBill invoice data:', JSON.stringify(invoiceData, null, 2))

    // Create invoice via SmartBill API with corrected authentication
    const smartBillAuth = btoa(`${email}:${token}`) // Using email:token as per documentation
    console.log('🔐 Authentication format: email:token (email format validated)')
    
    let invoiceResponse: Response
    let invoiceResult: any
    
    try {
      console.log('🚀 Sending request to SmartBill API:', `${baseUrl}/SBORO/api/invoice`)
      
      invoiceResponse = await fetch(`${baseUrl}/SBORO/api/invoice`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json', // Required header from documentation
          'Content-Type': 'application/json', // Required header from documentation
          'Authorization': `Basic ${smartBillAuth}`
        },
        body: JSON.stringify(invoiceData)
      })
      
      invoiceResult = await handleSmartBillResponse(invoiceResponse)
      
    } catch (smartBillError) {
      console.error('❌ SmartBill API Error:', smartBillError)
      
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

    // Check if SmartBill returned an error
    if (!invoiceResponse.ok || invoiceResult?.errorText || invoiceResult?.error) {
      const errorMessage = invoiceResult?.errorText || invoiceResult?.error || `HTTP ${invoiceResponse.status}`
      console.error('❌ SmartBill API returned error:', errorMessage)
      
      // Enhanced error logging for authentication issues
      if (errorMessage.includes('535') || errorMessage.includes('authentication') || errorMessage.includes('Incorrect authentication data')) {
        console.error('🔍 Authentication Debug Info:')
        console.error('- Using email format for username:', email?.includes('@') ? 'YES' : 'NO')
        console.error('- Email configured:', email ? 'YES' : 'NO')
        console.error('- Token configured:', token ? 'YES' : 'NO')
        console.error('- Full error:', errorMessage)
        console.error('- Suggestion: Verify that SMARTBILL_EMAIL is set to the email address associated with your SmartBill account')
      }
      
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

    // Success - extract invoice details
    const smartBillInvoiceId = invoiceResult?.number || `INV-${Date.now()}`
    const smartBillPaymentUrl = invoiceResult?.url
    
    const finalPaymentUrl = smartBillPaymentUrl || `${Deno.env.get('SITE_URL')}/payment/success?orderId=${savedOrder.id}&invoice=${smartBillInvoiceId}`

    console.log('✅ SmartBill invoice created successfully:', {
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
    console.error('💥 Error in SmartBill integration:', error)
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
