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
  payment_provider?: string;
  gift_card_id?: string;
  is_gift_redemption?: boolean;
  gift_credit_applied?: number;
  user_id?: string;
}

// Rate limiting for SmartBill API (max 3 calls per second)
let lastApiCall = 0
const API_RATE_LIMIT = 334 // ms between calls

async function rateLimitedFetch(url: string, options: RequestInit) {
  const now = Date.now()
  const timeSinceLastCall = now - lastApiCall
  
  if (timeSinceLastCall < API_RATE_LIMIT) {
    await new Promise(resolve => setTimeout(resolve, API_RATE_LIMIT - timeSinceLastCall))
  }
  
  lastApiCall = Date.now()
  return fetch(url, options)
}

function escapeXml(value: string): string {
  if (!value) return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const validateSmartBillConfig = () => {
  const username = Deno.env.get('SMARTBILL_USERNAME')
  const token = Deno.env.get('SMARTBILL_TOKEN')
  const baseUrl = Deno.env.get('SMARTBILL_BASE_URL') || 'https://ws.smartbill.ro'
  const companyVat = Deno.env.get('SMARTBILL_COMPANY_VAT')
  
  console.log('SmartBill Config Check:', {
    username: username ? `${username.substring(0, 3)}***` : 'MISSING',
    token: token ? `***${token.length} chars***` : 'MISSING',
    baseUrl,
    companyVat: companyVat ? `${companyVat.substring(0, 4)}***` : 'MISSING'
  })
  
  return { username, token, baseUrl, companyVat }
}

function validateOrderData(orderData: OrderData) {
  console.log('📋 Validating order data...')
  
  const requiredFields = ['form_data', 'total_price', 'package_name', 'currency']
  const missingFields = requiredFields.filter(field => {
    const value = orderData[field]
    return value === null || value === undefined || (typeof value === 'string' && value.trim() === '')
  })
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required order fields: ${missingFields.join(', ')}`)
  }
  
  if (!orderData.form_data.email || !orderData.form_data.fullName) {
    throw new Error('Missing required customer information: email and fullName')
  }
  
  console.log('✅ Order data validation passed')
  return true
}

function convertPriceBasedOnProvider(totalPrice: number, packagePrice: number, paymentProvider: string): number {
  console.log('💰 Converting price based on payment provider:', {
    originalTotalPrice: totalPrice,
    packagePrice: packagePrice,
    paymentProvider: paymentProvider
  })

  let convertedPrice = totalPrice;

  // Handle Stripe and Revolut which store prices in cents
  if (paymentProvider === 'stripe' || paymentProvider === 'revolut') {
    convertedPrice = totalPrice / 100; // Convert from cents to base units
    console.log('🔄 Converted from cents to base units:', {
      originalCents: totalPrice,
      convertedToBase: convertedPrice
    })
  }

  // Sanity check: if converted price seems unreasonable, use package_price as fallback
  if (convertedPrice > packagePrice * 10) {
    console.warn('⚠️ Converted price seems too high, using package_price as fallback:', {
      convertedPrice,
      packagePrice,
      usingFallback: true
    })
    convertedPrice = packagePrice;
  }

  // Additional sanity check: ensure price is positive and reasonable
  if (convertedPrice <= 0 || convertedPrice > 10000) {
    console.warn('⚠️ Price outside reasonable range, using package_price:', {
      convertedPrice,
      packagePrice,
      usingPackagePrice: true
    })
    convertedPrice = packagePrice;
  }

  console.log('✅ Final converted price:', convertedPrice)
  return convertedPrice;
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

    const { orderData }: { orderData: OrderData } = await req.json()
    console.log('🔄 Processing SmartBill order:', {
      totalPrice: orderData.total_price,
      packagePrice: orderData.package_price,
      currency: orderData.currency,
      packageName: orderData.package_name,
      paymentProvider: orderData.payment_provider,
      customerEmail: orderData.form_data?.email?.substring(0, 5) + '***'
    })

    // Validate order data first
    validateOrderData(orderData)

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
        payment_provider: 'smartbill',
        smartbill_payment_status: 'pending'
      })
      .select()
      .single()

    if (orderError) {
      console.error('❌ Database Error:', orderError)
      throw new Error(`Failed to save order: ${orderError.message}`)
    }

    console.log('✅ Order saved to database with ID:', savedOrder.id)

    // Convert price based on payment provider
    const convertedPrice = convertPriceBasedOnProvider(
      orderData.total_price, 
      orderData.package_price, 
      orderData.payment_provider || 'smartbill'
    );

    // Check if payment is needed
    if (convertedPrice <= 0) {
      console.log('💰 No payment required - completing order')
      
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
    const { username, token, baseUrl, companyVat } = validateSmartBillConfig()

    if (!username || !token || !companyVat) {
      console.error('❌ SmartBill configuration incomplete')
      
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ 
          smartbill_payment_status: 'config_error'
        })
        .eq('id', savedOrder.id)

      if (updateError) {
        console.error('Error updating order with config error:', updateError)
      }

      return new Response(
        JSON.stringify({ 
          success: false, 
          orderId: savedOrder.id,
          errorCode: 'paymentConfigError',
          message: 'SmartBill payment system not configured properly'
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

    // Determine if this is a company invoice
    const isCompanyInvoice = orderData.form_data.invoiceType === 'company'
    console.log('📊 Invoice type:', orderData.form_data.invoiceType, 'Is company:', isCompanyInvoice)

    // Prepare client data with proper validation
    const clientName = isCompanyInvoice ? 
      (orderData.form_data.companyName || orderData.form_data.fullName || 'Company Name') : 
      (orderData.form_data.fullName || 'Customer')
    
    const clientVatCode = isCompanyInvoice ? (orderData.form_data.vatCode || '') : ''
    const clientAddress = isCompanyInvoice ? 
      (orderData.form_data.companyAddress || orderData.form_data.address || 'No address provided') : 
      (orderData.form_data.address || 'No address provided')
    
    const clientCity = orderData.form_data.city || 'Bucuresti'
    const clientEmail = orderData.form_data.email || ''

    console.log('👤 Client data prepared:', {
      name: clientName,
      vatCode: clientVatCode,
      address: clientAddress,
      city: clientCity,
      email: clientEmail,
      isTaxPayer: isCompanyInvoice && !!clientVatCode
    })

    // Format price with two decimal places for SmartBill/Netopia compatibility
    const formattedPrice = convertedPrice.toFixed(2)

    console.log('💰 Final price formatting for SmartBill XML:', {
      originalTotalPrice: orderData.total_price,
      convertedPrice: convertedPrice,
      formattedPrice: formattedPrice,
      currency: orderData.currency,
      paymentProvider: orderData.payment_provider
    })

    // Prepare redirect URLs with order tracking
    const returnUrl = `https://www.musicgift.ro/payment/success?orderId=${savedOrder.id}&status=success`
    const cancelUrl = `https://www.musicgift.ro/payment/cancel?orderId=${savedOrder.id}&status=cancel`
    const notifyUrl = `https://ehvzhnzqcbzuirovwjsr.supabase.co/functions/v1/smartbill-webhook`
    
    // Create proforma with payment link using STRP series
    const proformaXml = `<?xml version="1.0" encoding="UTF-8"?>
<estimate>
  <companyVatCode>${escapeXml(companyVat)}</companyVatCode>
  <client>
    <name>${escapeXml(clientName)}</name>
    <vatCode>${escapeXml(clientVatCode)}</vatCode>
    <isTaxPayer>${isCompanyInvoice && !!clientVatCode ? 'true' : 'false'}</isTaxPayer>
    <address>${escapeXml(clientAddress)}</address>
    <city>${escapeXml(clientCity)}</city>
    <country>Romania</country>
    <email>${escapeXml(clientEmail)}</email>
  </client>
  <issueDate>${issueDate}</issueDate>
  <seriesName>STRP</seriesName>
  <dueDate>${dueDate}</dueDate>
  <paymentUrl>Generate URL</paymentUrl>
  <product>
    <name>${escapeXml(`${orderData.package_name} - Cadou Musical Personalizat`)}</name>
    <isDiscount>false</isDiscount>
    <measuringUnitName>buc</measuringUnitName>
    <currency>${orderData.currency === 'EUR' ? 'EUR' : 'RON'}</currency>
    <quantity>1</quantity>
    <price>${formattedPrice}</price>
    <isTaxIncluded>true</isTaxIncluded>
    <taxName>Normala</taxName>
    <taxPercentage>19</taxPercentage>
    <saveToDb>false</saveToDb>
    <isService>true</isService>
  </product>
  <returnUrl>${returnUrl}</returnUrl>
  <cancelUrl>${cancelUrl}</cancelUrl>
  <notifyUrl>${notifyUrl}</notifyUrl>
  <observations>${escapeXml(isCompanyInvoice && orderData.form_data.representativeName ?
    `Comandă cadou musical personalizat pentru ${orderData.form_data.recipientName || 'destinatar'}. Reprezentant companie: ${orderData.form_data.representativeName}. ID comandă: ${savedOrder.id}` :
    `Comandă cadou musical personalizat pentru ${orderData.form_data.recipientName || 'destinatar'}. ID comandă: ${savedOrder.id}`)}</observations>
</estimate>`

    console.log('📄 Creating SmartBill proforma with STRP series')
    console.log('🔗 XML payload prepared for SmartBill API with corrected price:', formattedPrice)

    // Create proforma via SmartBill API using XML format
    let proformaResponse: Response
    let responseText: string
    
    try {
      const apiUrl = `${baseUrl}/SBORO/api/estimate`
      console.log('🌐 Sending request to SmartBill API:', apiUrl)
      
      proformaResponse = await rateLimitedFetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${username}:${token}`)}`,
          'Content-Type': 'application/xml',
          'Accept': 'application/xml'
        },
        body: proformaXml
      })
      
      responseText = await proformaResponse.text()
      console.log('📥 SmartBill API Response Status:', proformaResponse.status)
      console.log('📥 SmartBill API Response:', responseText.substring(0, 500) + '...')
      
    } catch (fetchError) {
      console.error('🌐 Network Error calling SmartBill API:', fetchError)
      
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ 
          smartbill_payment_status: 'api_error',
          smartbill_proforma_data: `Network error: ${fetchError.message}`
        })
        .eq('id', savedOrder.id)

      if (updateError) {
        console.error('Error updating order with network error:', updateError)
      }

      return new Response(
        JSON.stringify({
          success: false,
          orderId: savedOrder.id,
          errorCode: 'paymentFailed',
          message: `Network error contacting SmartBill: ${fetchError.message}`
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Check if SmartBill returned an error
    if (!proformaResponse.ok) {
      console.error('❌ SmartBill API Error Response:', {
        status: proformaResponse.status,
        statusText: proformaResponse.statusText,
        body: responseText
      })
      
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ 
          smartbill_payment_status: 'api_error',
          smartbill_proforma_data: responseText
        })
        .eq('id', savedOrder.id)

      if (updateError) {
        console.error('Error updating order with API error:', updateError)
      }

      return new Response(
        JSON.stringify({
          success: false,
          orderId: savedOrder.id,
          errorCode: 'paymentFailed',
          message: `SmartBill API error (${proformaResponse.status}): ${responseText}`
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Parse XML response to extract payment URL and document number
    const urlMatch = responseText.match(/<url>(.*?)<\/url>/)
    const numberMatch = responseText.match(/<number>(.*?)<\/number>/)
    const seriesMatch = responseText.match(/<series>(.*?)<\/series>/)
    
    const smartBillPaymentUrl = urlMatch?.[1] || null
    const documentNumber = numberMatch?.[1] || null
    const documentSeries = seriesMatch?.[1] || 'STRP'
    
    console.log('📄 SmartBill document details extracted:', {
      number: documentNumber,
      series: documentSeries,
      paymentUrl: smartBillPaymentUrl ? 'URL Generated' : 'NO URL'
    })
    
    // Check if we got a valid payment URL
    if (!smartBillPaymentUrl) {
      console.error('❌ SmartBill did not return a payment URL')
      console.error('📄 Full response for debugging:', responseText)
      
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ 
          smartbill_proforma_id: documentNumber ? `${documentSeries}${documentNumber}` : null,
          smartbill_proforma_data: responseText,
          smartbill_payment_status: 'no_payment_url'
        })
        .eq('id', savedOrder.id)

      if (updateError) {
        console.error('Error updating order with payment URL failure:', updateError)
      }

      return new Response(
        JSON.stringify({
          success: false,
          orderId: savedOrder.id,
          errorCode: 'paymentUrlFailed',
          message: 'SmartBill document created but no payment URL generated - Netopia integration may not be configured'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    console.log('✅ SmartBill proforma created successfully')

    // Update order with SmartBill details
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({ 
        smartbill_proforma_id: documentNumber ? `${documentSeries}${documentNumber}` : null,
        smartbill_payment_url: smartBillPaymentUrl,
        smartbill_proforma_data: responseText,
        smartbill_payment_status: 'payment_url_generated',
        smartbill_proforma_status: 'created'
      })
      .eq('id', savedOrder.id)

    if (updateError) {
      console.error('Error updating order with SmartBill details:', updateError)
    }

    console.log('🎉 SmartBill integration completed successfully')

    return new Response(
      JSON.stringify({
        success: true,
        orderId: savedOrder.id,
        smartBillProformaId: documentNumber ? `${documentSeries}${documentNumber}` : null,
        paymentUrl: smartBillPaymentUrl,
        message: 'SmartBill proforma created successfully with payment link'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('💥 Critical Error in SmartBill integration:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        errorCode: 'orderCreationFailed',
        error: error.message || 'Failed to process order with SmartBill'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
