
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

// Rate limiting for SmartBill API
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { orderId, conversionSource = 'manual' } = await req.json()
    console.log('🧾 Converting order to invoice:', orderId, 'Source:', conversionSource)

    // Get order details
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      throw new Error(`Order not found: ${orderError?.message}`)
    }

    console.log('📋 Order details for conversion:', {
      id: order.id,
      payment_status: order.payment_status,
      smartbill_payment_status: order.smartbill_payment_status,
      total_price: order.total_price,
      smartbill_proforma_id: order.smartbill_proforma_id
    })

    // Check if order is eligible for invoice conversion
    // Allow conversion if either payment_status is completed OR smartbill_payment_status is paid
    // OR if it's manual admin conversion (bypass payment check)
    const isPaid = order.payment_status === 'completed' || 
                   order.smartbill_payment_status === 'paid' ||
                   conversionSource === 'admin_manual'
    
    if (!isPaid) {
      console.log('❌ Order not paid:', {
        payment_status: order.payment_status,
        smartbill_payment_status: order.smartbill_payment_status,
        conversionSource
      })
      throw new Error('Order must be paid before converting to invoice (unless manual admin conversion)')
    }

    // Check if invoice already exists
    if (order.smartbill_invoice_id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invoice already exists',
          invoiceId: order.smartbill_invoice_id
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Mark conversion as requested
    await supabaseClient
      .from('orders')
      .update({
        invoice_conversion_requested_at: new Date().toISOString(),
        invoice_conversion_source: conversionSource
      })
      .eq('id', orderId)

    // Get SmartBill configuration
    const username = Deno.env.get('SMARTBILL_USERNAME')
    const token = Deno.env.get('SMARTBILL_TOKEN')
    const baseUrl = Deno.env.get('SMARTBILL_BASE_URL') || 'https://ws.smartbill.ro'
    const companyVat = Deno.env.get('SMARTBILL_COMPANY_VAT')
    const invoiceSeries = Deno.env.get('SMARTBILL_INVOICE_SERIES') || 'MNG'

    if (!username || !token || !companyVat) {
      throw new Error('SmartBill configuration incomplete')
    }

    console.log('📄 Using invoice series:', invoiceSeries)

    // Convert price based on payment provider - but check if it's already correct
    let convertedPrice = order.total_price
    
    // Only convert from cents if the price seems to be in cents format
    if (order.payment_provider === 'stripe' || order.payment_provider === 'revolut') {
      // If price is very large (likely in cents), convert it
      if (convertedPrice > 1000) {
        convertedPrice = order.total_price / 100
        console.log('💰 Converting price from cents:', order.total_price, '→', convertedPrice)
      } else {
        console.log('💰 Price already in correct format:', convertedPrice)
      }
    }

    // Prepare customer data
    const formData = order.form_data || {}
    const isCompanyInvoice = formData.invoiceType === 'company'
    
    const clientName = isCompanyInvoice ? 
      (formData.companyName || formData.fullName || 'Company Name') : 
      (formData.fullName || 'Customer')
    
    const clientVatCode = isCompanyInvoice ? (formData.vatCode || '') : ''
    const clientAddress = isCompanyInvoice ? 
      (formData.companyAddress || formData.address || 'No address provided') : 
      (formData.address || 'No address provided')
    
    const clientCity = formData.city || 'Bucuresti'
    const clientEmail = formData.email || ''

    // Calculate dates
    const issueDate = new Date().toISOString().split('T')[0]
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const formattedPrice = convertedPrice.toFixed(2)

    console.log('💰 Invoice details:', {
      originalPrice: order.total_price,
      convertedPrice,
      formattedPrice,
      clientName,
      packageName: order.package_name,
      invoiceSeries
    })

    // Create invoice XML
    const invoiceXml = `<?xml version="1.0" encoding="UTF-8"?>
<invoice>
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
  <seriesName>${escapeXml(invoiceSeries)}</seriesName>
  <dueDate>${dueDate}</dueDate>
  <product>
    <name>${escapeXml(`${order.package_name} - Cadou Musical Personalizat`)}</name>
    <isDiscount>false</isDiscount>
    <measuringUnitName>buc</measuringUnitName>
    <currency>${order.currency === 'EUR' ? 'EUR' : 'RON'}</currency>
    <quantity>1</quantity>
    <price>${formattedPrice}</price>
    <isTaxIncluded>true</isTaxIncluded>
    <taxName>Normala</taxName>
    <taxPercentage>19</taxPercentage>
    <saveToDb>false</saveToDb>
    <isService>true</isService>
  </product>
  <observations>${escapeXml(`Comandă cadou musical personalizat pentru ${formData.recipientName || 'destinatar'}. ID comandă: ${order.id}`)}</observations>
</invoice>`

    console.log('📄 Creating SmartBill invoice with XML:', invoiceXml.substring(0, 300))

    // Create invoice via SmartBill API
    const apiUrl = `${baseUrl}/SBORO/api/invoice`
    const invoiceResponse = await rateLimitedFetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${token}`)}`,
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
      },
      body: invoiceXml
    })

    const responseText = await invoiceResponse.text()
    console.log('📥 SmartBill Invoice API Response:', invoiceResponse.status, responseText.substring(0, 500))

    if (!invoiceResponse.ok) {
      throw new Error(`SmartBill API error (${invoiceResponse.status}): ${responseText}`)
    }

    // Parse XML response to extract invoice details
    const numberMatch = responseText.match(/<number>(.*?)<\/number>/)
    const seriesMatch = responseText.match(/<series>(.*?)<\/series>/)
    
    const invoiceNumber = numberMatch?.[1] || null
    const invoiceSeriesFromResponse = seriesMatch?.[1] || invoiceSeries
    const invoiceId = invoiceNumber ? `${invoiceSeriesFromResponse}${invoiceNumber}` : null
    
    if (!invoiceId) {
      throw new Error('SmartBill did not return a valid invoice ID')
    }

    console.log('✅ SmartBill invoice created:', invoiceId)

    // Update order with invoice details
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        smartbill_invoice_id: invoiceId,
        smartbill_invoice_data: responseText,
        smartbill_payment_status: 'paid',
        status: order.status === 'pending' ? 'completed' : order.status
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('❌ Error updating order with invoice details:', updateError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        invoiceId,
        orderId,
        message: `Invoice ${invoiceId} created successfully`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('💥 Error converting to invoice:', error)
    
    // Update order with error
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )
      
      const { orderId } = await req.json().catch(() => ({}))
      if (orderId) {
        await supabaseClient
          .from('orders')
          .update({
            smartbill_invoice_error: error.message
          })
          .eq('id', orderId)
      }
    } catch (updateError) {
      console.error('Error updating order with error:', updateError)
    }

    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to convert to invoice'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
