
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

async function findInvoiceInSmartBill(auth: string, companyVat: string, searchTerm: string) {
  console.log('🔍 Searching for invoice in SmartBill:', searchTerm)
  
  // Try different series that might be used for invoices
  const seriesToTry = ['FACT', 'INV', 'INVOICE', '']
  
  for (const series of seriesToTry) {
    try {
      const paymentStatusUrl = `https://ws.smartbill.ro/SBORO/api/invoice/paymentstatus?cif=${companyVat}&seriesname=${encodeURIComponent(series)}&number=${encodeURIComponent(searchTerm)}`
      
      console.log(`🔍 Trying series "${series}" with number "${searchTerm}"`)
      
      const response = await rateLimitedFetch(paymentStatusUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (!data.errorText) {
          console.log(`✅ Found invoice with series "${series}":`, data)
          return { series, number: searchTerm, data }
        }
      }
    } catch (error) {
      console.log(`❌ Error checking series "${series}":`, error.message)
    }
  }
  
  return null
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

    const { orderId, invoiceReference } = await req.json()
    
    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🔄 Syncing SmartBill invoice for order: ${orderId}`)

    // Get the order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('❌ Order not found:', orderError)
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get SmartBill credentials
    const smartbillUsername = Deno.env.get('SMARTBILL_USERNAME')
    const smartbillToken = Deno.env.get('SMARTBILL_TOKEN')
    const smartbillCompanyVat = Deno.env.get('SMARTBILL_COMPANY_VAT')
    
    if (!smartbillUsername || !smartbillToken || !smartbillCompanyVat) {
      console.error('❌ SmartBill credentials not configured')
      return new Response(
        JSON.stringify({ error: 'SmartBill credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const smartbillAuth = btoa(`${smartbillUsername}:${smartbillToken}`)
    
    // Search for the invoice
    const searchReference = invoiceReference || order.smartbill_proforma_id || order.id.slice(0, 8)
    const invoiceData = await findInvoiceInSmartBill(smartbillAuth, smartbillCompanyVat, searchReference)
    
    if (!invoiceData) {
      console.log('❌ Invoice not found in SmartBill')
      return new Response(
        JSON.stringify({ 
          error: 'Invoice not found in SmartBill',
          searchedReference: searchReference
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update order with invoice information
    const invoiceId = `${invoiceData.series}${invoiceData.number}`
    const { invoiceTotalAmount, paidAmount, unpaidAmount } = invoiceData.data
    
    let newPaymentStatus = 'pending'
    let newSmartbillStatus = 'pending'
    
    if (unpaidAmount === 0 && paidAmount === invoiceTotalAmount) {
      newPaymentStatus = 'completed'
      newSmartbillStatus = 'paid'
    } else if (paidAmount > 0) {
      newPaymentStatus = 'pending'
      newSmartbillStatus = 'partially_paid'
    }

    const updateData = {
      smartbill_invoice_id: invoiceId,
      smartbill_invoice_data: invoiceData.data,
      payment_status: newPaymentStatus,
      smartbill_payment_status: newSmartbillStatus,
      status: newPaymentStatus === 'completed' ? 'confirmed' : order.status,
      updated_at: new Date().toISOString()
    }

    const { error: updateError } = await supabaseClient
      .from('orders')
      .update(updateData)
      .eq('id', orderId)

    if (updateError) {
      console.error('❌ Error updating order:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`✅ Order ${orderId} synced with invoice ${invoiceId}`)

    return new Response(
      JSON.stringify({
        success: true,
        orderId,
        invoiceId,
        paymentStatus: newPaymentStatus,
        smartbillStatus: newSmartbillStatus,
        paymentDetails: {
          total: invoiceTotalAmount,
          paid: paidAmount,
          unpaid: unpaidAmount
        },
        message: `Invoice ${invoiceId} synced successfully`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('💥 Error syncing SmartBill invoice:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
