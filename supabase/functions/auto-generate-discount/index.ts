
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generateDiscountCode(prefix: string): string {
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
  const timestamp = Date.now().toString(36).substring(-4).toUpperCase()
  return `${prefix}${randomPart}${timestamp}`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { orderId, userId, orderAmount, customerEmail, customerName, isFirstOrder } = await req.json()

    console.log('Auto-generation triggered for order:', { orderId, userId, orderAmount, isFirstOrder })

    // Get active auto-generation rules
    const { data: rules, error: rulesError } = await supabaseClient
      .from('discount_auto_rules')
      .select('*')
      .eq('enabled', true)
      .order('created_at', { ascending: true })

    if (rulesError) {
      throw new Error(`Failed to fetch rules: ${rulesError.message}`)
    }

    console.log('Found active rules:', rules?.length || 0)

    // Process each applicable rule
    const generatedCodes = []

    for (const rule of rules || []) {
      let shouldGenerate = false

      // Check trigger conditions
      switch (rule.trigger_type) {
        case 'order_completed':
          shouldGenerate = true
          break
        case 'first_order':
          shouldGenerate = isFirstOrder
          break
        case 'order_amount':
          shouldGenerate = orderAmount >= rule.minimum_order_amount
          break
      }

      if (!shouldGenerate) {
        console.log(`Rule ${rule.name} not triggered for this order`)
        continue
      }

      // Check if customer has reached limit for this rule
      if (rule.limit_per_customer) {
        const { count } = await supabaseClient
          .from('discount_codes')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', userId)
          .ilike('code', `${rule.code_prefix}%`)

        if (count && count >= rule.limit_per_customer) {
          console.log(`Customer has reached limit for rule ${rule.name}`)
          continue
        }
      }

      // Generate unique discount code
      let newCode = generateDiscountCode(rule.code_prefix)
      let codeExists = true
      let attempts = 0

      while (codeExists && attempts < 10) {
        const { data: existing } = await supabaseClient
          .from('discount_codes')
          .select('id')
          .eq('code', newCode)
          .single()

        if (!existing) {
          codeExists = false
        } else {
          newCode = generateDiscountCode(rule.code_prefix)
          attempts++
        }
      }

      if (attempts >= 10) {
        console.error(`Failed to generate unique code after 10 attempts for rule ${rule.name}`)
        continue
      }

      // Calculate expiry date
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + rule.validity_days)

      // Create discount code
      const { data: discountCode, error: codeError } = await supabaseClient
        .from('discount_codes')
        .insert({
          code: newCode,
          discount_type: rule.discount_type,
          discount_value: rule.discount_value,
          minimum_order_amount: rule.minimum_order_amount || 0,
          maximum_discount_amount: rule.maximum_discount_amount,
          usage_limit: rule.limit_per_customer || null,
          expires_at: expiryDate.toISOString(),
          is_active: true,
          created_by: userId,
          used_count: 0
        })
        .select()
        .single()

      if (codeError) {
        console.error(`Failed to create discount code for rule ${rule.name}:`, codeError)
        continue
      }

      console.log(`Generated discount code: ${newCode} for rule: ${rule.name}`)
      generatedCodes.push({ rule, discountCode })

      // Send email notification
      try {
        const emailResponse = await supabaseClient.functions.invoke('send-auto-discount-email', {
          body: {
            orderId,
            discountCode,
            customerEmail,
            customerName
          }
        })

        if (emailResponse.error) {
          console.error(`Failed to send email for code ${newCode}:`, emailResponse.error)
        } else {
          console.log(`Email sent successfully for code ${newCode}`)
        }
      } catch (emailError) {
        console.error(`Email sending error for code ${newCode}:`, emailError)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Generated ${generatedCodes.length} discount codes`,
        codes: generatedCodes.map(({ discountCode }) => discountCode.code)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Auto-generation error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
