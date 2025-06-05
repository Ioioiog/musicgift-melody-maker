
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

const escapeXml = (unsafe: string): string => {
  if (!unsafe || typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const validateAndCleanField = (value: any, defaultValue: string = ''): string => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  return String(value).trim();
}

const validateEmail = (email: string): string => {
  if (!email || !email.includes('@')) {
    return '';
  }
  return email.trim();
}

const parseSmartBillError = (htmlResponse: string): string => {
  try {
    // Try to extract meaningful error from HTML response
    const messageMatch = htmlResponse.match(/<b>message<\/b>\s*([^<]+)/i);
    const descriptionMatch = htmlResponse.match(/<b>description<\/b>\s*([^<]+)/i);
    
    if (messageMatch || descriptionMatch) {
      return `${messageMatch?.[1] || ''} ${descriptionMatch?.[1] || ''}`.trim();
    }
    
    // If HTML parsing fails, return a cleaned version
    return htmlResponse.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
  } catch (error) {
    return 'Unable to parse SmartBill error response';
  }
}

const generateSmartBillEstimateXML = (data: any) => {
  const { companyVatCode, seriesName, client, issueDate, dueDate, currency, products } = data
  
  // Validate and clean all client fields (simplified structure)
  const clientName = validateAndCleanField(client.name, 'Client Necunoscut');
  const clientVatCode = validateAndCleanField(client.vatCode);
  const clientAddress = validateAndCleanField(client.address);
  const clientCity = validateAndCleanField(client.city, 'Bucuresti');
  const clientCountry = validateAndCleanField(client.country, 'Romania');
  const clientEmail = validateEmail(client.email);
  
  // Ensure boolean is properly formatted
  const isTaxPayer = client.isTaxPayer === true ? 'true' : 'false';
  
  console.log('🔍 Validated client data:', {
    name: clientName,
    vatCode: clientVatCode,
    email: clientEmail,
    isTaxPayer,
    city: clientCity,
    country: clientCountry
  });

  // Generate products XML (direct under estimate, no wrapper)
  const productsXml = products.map((product: any) => {
    const productName = validateAndCleanField(product.name, 'Produs Necunoscut');
    const quantity = Number(product.quantity) || 1;
    const price = Number(product.price) || 0;
    const isService = product.productType === 'Serviciu' ? 'true' : 'false';
    
    console.log('🔍 Validated product data:', {
      name: productName,
      quantity,
      price,
      isService
    });
    
    return `  <product>
    <name>${escapeXml(productName)}</name>
    <isDiscount>false</isDiscount>
    <measuringUnitName>buc</measuringUnitName>
    <currency>${escapeXml(currency)}</currency>
    <quantity>${quantity}</quantity>
    <price>${price}</price>
    <isTaxIncluded>true</isTaxIncluded>
    <taxName>Normala</taxName>
    <taxPercentage>19</taxPercentage>
    <saveToDb>false</saveToDb>
    <isService>${isService}</isService>
  </product>`
  }).join('\n')

  // Generate XML with exact structure from sample
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<estimate>
  <companyVatCode>${escapeXml(companyVatCode)}</companyVatCode>
  <client>
    <name>${escapeXml(clientName)}</name>
    <vatCode>${escapeXml(clientVatCode)}</vatCode>
    <isTaxPayer>${isTaxPayer}</isTaxPayer>
    <address>${escapeXml(clientAddress)}</address>
    <city>${escapeXml(clientCity)}</city>
    <country>${escapeXml(clientCountry)}</country>
    <email>${escapeXml(clientEmail)}</email>
  </client>
  <issueDate>${escapeXml(issueDate)}</issueDate>
  <seriesName>${escapeXml(seriesName)}</seriesName>
  <dueDate>${escapeXml(dueDate)}</dueDate>
${productsXml}
</estimate>`

  console.log('📋 Generated XML structure validation:');
  console.log('- Root element: estimate');
  console.log('- Company VAT Code:', companyVatCode);
  console.log('- Series Name:', seriesName);
  console.log('- Issue Date:', issueDate);
  console.log('- Due Date:', dueDate);
  console.log('- Currency:', currency);
  console.log('- Products count:', products.length);
  console.log('- Products directly under estimate: true');

  return xmlContent;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { orderData } = await req.json()

    console.log('📦 Processing SmartBill estimate for order:', orderData.id)

    const username = Deno.env.get('SMARTBILL_USERNAME')
    const token = Deno.env.get('SMARTBILL_TOKEN')
    const baseUrl = Deno.env.get('SMARTBILL_BASE_URL') || 'https://ws.smartbill.ro'
    const companyVatCode = Deno.env.get('SMARTBILL_COMPANY_VAT')!
    const seriesName = Deno.env.get('SMARTBILL_SERIES') || 'PFC'

    console.log('🔧 SmartBill config:', { 
      baseUrl, 
      username: username ? 'SET' : 'MISSING', 
      token: token ? 'SET' : 'MISSING',
      companyVatCode,
      seriesName
    })

    if (!username || !token) {
      throw new Error('SmartBill credentials not configured')
    }

    if (!companyVatCode) {
      throw new Error('SmartBill company VAT code not configured')
    }

    const invoiceType = orderData.form_data?.invoiceType || 'individual'
    const isCompany = invoiceType === 'company'
    const currency = ['RON', 'EUR'].includes(orderData.currency) ? orderData.currency : 'RON'
    const issueDate = new Date().toISOString().split('T')[0]
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Convert price from cents to currency units if needed
    const totalPrice = typeof orderData.total_price === 'number' 
      ? (orderData.total_price > 1000 ? orderData.total_price / 100 : orderData.total_price)
      : parseFloat(orderData.total_price) || 0

    console.log('💰 Price calculation:', {
      originalPrice: orderData.total_price,
      calculatedPrice: totalPrice,
      currency
    });

    const client = {
      name: isCompany 
        ? validateAndCleanField(orderData.form_data?.companyName, 'Firma Necunoscuta') 
        : validateAndCleanField(orderData.form_data?.fullName, 'Client Necunoscut'),
      vatCode: isCompany ? validateAndCleanField(orderData.form_data?.vatCode) : '',
      address: validateAndCleanField(orderData.form_data?.address),
      city: validateAndCleanField(orderData.form_data?.city, 'Bucuresti'),
      country: 'Romania',
      email: validateEmail(orderData.form_data?.email || ''),
      isTaxPayer: isCompany && orderData.form_data?.vatCode
    }

    // Validate required fields
    if (!client.name || client.name === 'Client Necunoscut') {
      console.warn('⚠️ Missing or invalid client name, using default');
    }
    
    if (totalPrice <= 0) {
      throw new Error('Invalid total price: must be greater than 0');
    }

    const products = [{
      name: validateAndCleanField(`${orderData.package_name || 'Pachet Muzical'} - Cadou Muzical Personalizat`),
      quantity: 1,
      price: totalPrice,
      productType: 'Serviciu'
    }]

    const xmlBody = generateSmartBillEstimateXML({
      companyVatCode,
      seriesName,
      client,
      issueDate,
      dueDate,
      currency,
      products
    })

    const apiUrl = `${baseUrl}/SBORO/api/estimate`
    console.log('🔗 Calling SmartBill API:', apiUrl)
    console.log('📤 Complete XML being sent to SmartBill:')
    console.log(xmlBody)
    console.log('📤 XML Length:', xmlBody.length, 'characters')
    console.log('📤 XML Validation:')
    console.log('- Has <?xml declaration:', xmlBody.includes('<?xml'))
    console.log('- Root element is <estimate>:', xmlBody.includes('<estimate>'))
    console.log('- Has client section:', xmlBody.includes('<client>'))
    console.log('- Has product section:', xmlBody.includes('<product>'))
    console.log('- Ends with </estimate>:', xmlBody.includes('</estimate>'))

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${token}`)}`,
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
      },
      body: xmlBody
    })

    const responseText = await response.text()
    console.log('📨 SmartBill response status:', response.status)
    console.log('📨 SmartBill response headers:', Object.fromEntries(response.headers.entries()))
    console.log('📨 SmartBill full response:', responseText)

    if (!response.ok) {
      const errorMessage = parseSmartBillError(responseText);
      console.error('❌ SmartBill API error:', errorMessage)
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'SmartBill API error', 
        message: errorMessage,
        status: response.status,
        rawResponse: responseText.substring(0, 1000), // Include part of raw response for debugging
        sentXML: xmlBody // Include the XML we sent for debugging
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    // Parse XML response to extract key information
    let estimateNumber = null
    let estimateUrl = null
    let series = null

    try {
      const urlMatch = responseText.match(/<url>(.*?)<\/url>/)
      const numberMatch = responseText.match(/<number>(.*?)<\/number>/)
      const seriesMatch = responseText.match(/<series>(.*?)<\/series>/)
      
      estimateUrl = urlMatch?.[1] || null
      estimateNumber = numberMatch?.[1] || null
      series = seriesMatch?.[1] || null

      console.log('✅ Extracted from response:', { estimateNumber, estimateUrl, series })
    } catch (parseError) {
      console.warn('⚠️ Could not parse SmartBill response:', parseError)
    }

    // Update order with SmartBill estimate information
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        smartbill_proforma_id: estimateNumber,
        smartbill_payment_url: estimateUrl,
        smartbill_proforma_status: 'pending'
      })
      .eq('id', orderData.id)

    if (updateError) {
      console.error('❌ Error updating order:', updateError)
    } else {
      console.log('✅ Order updated with SmartBill estimate data')
    }

    return new Response(JSON.stringify({ 
      success: true, 
      estimateNumber, 
      estimateUrl, 
      series,
      message: 'Estimate created successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('💥 Function error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal error', 
      message: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  }
})
