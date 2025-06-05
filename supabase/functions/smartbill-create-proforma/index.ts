// Supabase Edge Function (Deno) - smartbill-create-proforma.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const { orderData } = await req.json()
    const username = Deno.env.get('SMARTBILL_USERNAME')
    const token = Deno.env.get('SMARTBILL_TOKEN')
    const companyVat = Deno.env.get('SMARTBILL_COMPANY_VAT')
    const baseUrl = Deno.env.get('SMARTBILL_BASE_URL') || 'https://ws.smartbill.ro'
    const seriesName = Deno.env.get('SMARTBILL_SERIES') || 'STRP'

    if (!username || !token || !companyVat) {
      throw new Error('SmartBill credentials/config missing')
    }

    const auth = btoa(`${username}:${token}`)

    const estimateData = {
      companyVatCode: companyVat,
      seriesName: seriesName,
      client: {
        name: orderData.form_data.fullName || 'Client MusicGift',
        email: orderData.form_data.email,
        country: 'Romania',
        isTaxPayer: false
      },
      currency: orderData.currency || 'RON',
      issueDate: new Date().toISOString().split('T')[0],
      language: 'RO',
      sendEmail: false,
      precision: 2,
      estimateProducts: [
        {
          name: `${orderData.package_name} - Cadou Muzical Personalizat`,
          isService: true,
          isDiscount: false,
          quantity: 1,
          price: orderData.total_price,
          measuringUnitName: 'buc',
          isTaxIncluded: true,
          taxPercentage: 19
        }
      ]
    }

    const response = await fetch(`${baseUrl}/SBORO/api/estimate`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(estimateData)
    })

    const text = await response.text()
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      throw new Error(`SmartBill proforma creation failed (${response.status}): ${text}`)
    }

    if (!response.ok || parsed?.errorText) {
      throw new Error(`SmartBill proforma creation failed (${response.status}): ${text}`)
    }

    await supabase.from('orders').update({
      smartbill_proforma_url: parsed.url,
      smartbill_proforma_status: 'success',
      smartbill_proforma_data: parsed
    }).eq('id', orderData.id)

    return new Response(JSON.stringify({ success: true, url: parsed.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (e) {
    console.error('SmartBill Proforma Error:', e.message)
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
