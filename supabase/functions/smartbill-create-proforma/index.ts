// File: smartbill-create-proforma.ts (Supabase Edge Function using XML)

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
  user_id?: string;
  gift_card_id?: string;
  is_gift_redemption?: boolean;
  gift_credit_applied?: number;
}

function convertEstimateDataToXML(data: any): string {
  const productXML = data.products.map((p: any) => `
    <product>
      <name>${p.name}</name>
      <quantity>${p.quantity}</quantity>
      <price>${p.price}</price>
      <currency>${p.currency}</currency>
      <measuringUnitName>${p.measuringUnitName}</measuringUnitName>
      <isTaxIncluded>${p.isTaxIncluded}</isTaxIncluded>
      <taxName>${p.taxName}</taxName>
      <taxPercentage>${p.taxPercentage}</taxPercentage>
      <isService>${p.isService}</isService>
    </product>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<estimate>
  <companyVatCode>${data.companyVatCode}</companyVatCode>
  <seriesName>${data.seriesName}</seriesName>
  <client>
    <name>${data.client.name}</name>
    <country>${data.client.country}</country>
    <isTaxPayer>${data.client.isTaxPayer}</isTaxPayer>
    <email>${data.client.email || ''}</email>
  </client>
  <issueDate>${data.issueDate}</issueDate>
  <dueDate>${data.dueDate}</dueDate>
  <deliveryDate>${data.deliveryDate}</deliveryDate>
  <isDraft>${data.isDraft}</isDraft>
  <language>${data.language}</language>
  <sendEmail>${data.sendEmail}</sendEmail>
  <precision>${data.precision}</precision>
  <currency>${data.currency}</currency>
  <products>${productXML}</products>
  <observations>${data.observations || ''}</observations>
</estimate>`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { orderData }: { orderData: OrderData } = await req.json()
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const { SMARTBILL_USERNAME, SMARTBILL_TOKEN, SMARTBILL_COMPANY_VAT, SMARTBILL_SERIES, SMARTBILL_BASE_URL } = Deno.env.toObject()
    const baseUrl = SMARTBILL_BASE_URL || 'https://ws.smartbill.ro'

    const issueDate = new Date().toISOString().split('T')[0]
    const dueDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

    const client = {
      name: orderData.form_data.fullName,
      country: 'Romania',
      email: orderData.form_data.email,
      isTaxPayer: true
    }

    const estimate = {
      companyVatCode: SMARTBILL_COMPANY_VAT,
      seriesName: SMARTBILL_SERIES || 'mng',
      client,
      issueDate,
      dueDate,
      deliveryDate: dueDate,
      isDraft: false,
      language: 'RO',
      sendEmail: true,
      precision: 2,
      currency: orderData.currency || 'RON',
      products: [{
        name: `${orderData.package_name} - Cadou Muzical`,
        quantity: 1,
        price: orderData.total_price,
        measuringUnitName: 'buc',
        currency: orderData.currency || 'RON',
        isTaxIncluded: true,
        taxName: 'Normala',
        taxPercentage: 19,
        isService: true
      }],
      observations: `Comandă pentru ${orderData.form_data.recipientName || 'destinatar'}`
    }

    const xmlBody = convertEstimateDataToXML(estimate)

    const response = await fetch(`${baseUrl}/SBORO/api/estimate`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${SMARTBILL_USERNAME}:${SMARTBILL_TOKEN}`)}`,
        'Content-Type': 'application/xml',
        'Accept': 'application/xml'
      },
      body: xmlBody
    })

    const text = await response.text()

    if (!response.ok) {
      console.error('SmartBill error response:', text)
      return new Response(JSON.stringify({ success: false, error: `SmartBill proforma creation failed (${response.status}): ${text}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    return new Response(JSON.stringify({ success: true, rawResponse: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
