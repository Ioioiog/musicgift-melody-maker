
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
        payment_provider: 'smartbill',
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

    if (!username || !token) {
      console.warn('SmartBill credentials not configured')
      
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ 
          smartbill_payment_status: 'config_missing'
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
          message: 'Payment system configuration error'
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
    console.log('Invoice type:', orderData.form_data.invoiceType, 'Is company invoice:', isCompanyInvoice)

    // Prepare client data
    const clientName = isCompanyInvoice ? 
      (orderData.form_data.companyName || 'Company Name') : 
      (orderData.form_data.fullName || 'Customer')
    
    const clientVatCode = isCompanyInvoice ? (orderData.form_data.vatCode || '') : ''
    
    const clientAddress = isCompanyInvoice ? 
      (orderData.form_data.companyAddress || orderData.form_data.address || '') : 
      (orderData.form_data.address || '')
    
    const clientCity = orderData.form_data.city || 'Bucuresti'
    const clientEmail = orderData.form_data.email || ''

    console.log('Client data for SmartBill:', {
      name: clientName,
      vatCode: clientVatCode,
      address: clientAddress,
      city: clientCity,
      email: clientEmail,
      isTaxPayer: isCompanyInvoice && !!clientVatCode
    })

    // Step 1: Create proforma with payment link using STRP series
    const totalPrice = parseFloat(orderData.total_price.toString()) || 0
    
    const proformaXml = `<?xml version="1.0" encoding="UTF-8"?>
<estimate>
  <companyVatCode>${companyVat}</companyVatCode>
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
    <currency>${orderData.currency || 'RON'}</currency>
    <quantity>1</quantity>
    <price>${totalPrice}</price>
    <isTaxIncluded>true</isTaxIncluded>
    <taxName>Normala</taxName>
    <taxPercentage>19</taxPercentage>
    <saveToDb>false</saveToDb>
    <isService>true</isService>
  </product>
  <observations>${escapeXml(isCompanyInvoice && orderData.form_data.representativeName ?
    `Comandă cadou musical personalizat pentru ${orderData.form_data.recipientName || 'destinatar'}. Reprezentant companie: ${orderData.form_data.representativeName}. ID comandă: ${savedOrder.id}` :
    `Comandă cadou musical personalizat pentru ${orderData.form_data.recipientName || 'destinatar'}. ID comandă: ${savedOrder.id}`)}</observations>
</estimate>`

    console.log('Creating proforma with payment link using STRP series')

    // Create proforma via SmartBill API using XML format
    let proformaResponse: Response
    let responseText: string
    
    try {
      console.log('Sending proforma request to SmartBill API:', `${baseUrl}/SBORO/api/estimate`)
      
      proformaResponse = await rateLimitedFetch(`${baseUrl}/SBORO/api/estimate`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${username}:${token}`)}`,
          'Content-Type': 'application/xml',
          'Accept': 'application/xml'
        },
        body: proformaXml
      })
      
      responseText = await proformaResponse.text()
      console.log('SmartBill Proforma API Response:', responseText)
      
    } catch (smartBillError) {
      console.error('SmartBill Proforma API Error:', smartBillError)
      
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ 
          smartbill_payment_status: 'failed'
        })
        .eq('id', savedOrder.id)

      if (updateError) {
        console.error('Error updating order with SmartBill error:', updateError)
      }

      return new Response(
        JSON.stringify({
          success: false,
          orderId: savedOrder.id,
          errorCode: 'paymentFailed',
          message: 'Failed to generate payment link'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Check if SmartBill returned an error
    if (!proformaResponse.ok) {
      console.error('SmartBill Proforma API Error:', {
        status: proformaResponse.status,
        statusText: proformaResponse.statusText,
        response: responseText
      })
      
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ 
          smartbill_payment_status: 'failed'
        })
        .eq('id', savedOrder.id)

      if (updateError) {
        console.error('Error updating order with SmartBill error:', updateError)
      }

      return new Response(
        JSON.stringify({
          success: false,
          orderId: savedOrder.id,
          errorCode: 'paymentFailed',
          message: `Payment system error: ${proformaResponse.status} ${proformaResponse.statusText}`
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
    
    console.log('Extracted proforma details:', {
      number: documentNumber,
      series: documentSeries,
      paymentUrl: smartBillPaymentUrl
    })
    
    // Check if we got a valid payment URL
    if (!smartBillPaymentUrl) {
      console.error('SmartBill did not return a payment URL')
      console.error('Response:', responseText)
      
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ 
          smartbill_proforma_id: documentNumber ? `${documentSeries}${documentNumber}` : null,
          smartbill_proforma_data: responseText,
          smartbill_payment_status: 'failed'
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
          message: 'Failed to generate payment link - Netopia integration not configured'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    console.log('SmartBill proforma created successfully:', {
      proformaId: `${documentSeries}${documentNumber}`,
      paymentUrl: smartBillPaymentUrl
    })

    // Update order with SmartBill details
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({ 
        smartbill_proforma_id: documentNumber ? `${documentSeries}${documentNumber}` : null,
        smartbill_payment_url: smartBillPaymentUrl,
        smartbill_proforma_data: responseText,
        smartbill_payment_status: 'pending',
        smartbill_proforma_status: 'created'
      })
      .eq('id', savedOrder.id)

    if (updateError) {
      console.error('Error updating order with SmartBill details:', updateError)
    }

    console.log('Returning successful response with payment URL:', smartBillPaymentUrl)

    return new Response(
      JSON.stringify({
        success: true,
        orderId: savedOrder.id,
        smartBillProformaId: documentNumber ? `${documentSeries}${documentNumber}` : null,
        paymentUrl: smartBillPaymentUrl,
        message: 'Proforma created successfully with payment link'
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
