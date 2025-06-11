
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🟣 Stripe Create Payment: Starting enhanced checkout process');
    
    // Use service role key for database operations to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Parse and validate request body
    let requestBody;
    try {
      const requestText = await req.text();
      console.log('🟣 Stripe: Raw request text:', requestText);
      
      if (!requestText || requestText.trim() === '') {
        throw new Error('Request body is empty');
      }
      
      requestBody = JSON.parse(requestText);
      console.log('🟣 Stripe: Parsed request body:', JSON.stringify(requestBody, null, 2));
    } catch (parseError) {
      console.error('❌ Stripe: Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Invalid JSON in request body: ${parseError.message}`,
          errorCode: 'invalidRequestBody',
          provider: 'stripe'
        }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Extract orderData and returnUrl from request body
    const { orderData, returnUrl } = requestBody;
    console.log('🟣 Stripe: Extracted orderData:', JSON.stringify(orderData, null, 2));
    console.log('🟣 Stripe: Return URL:', returnUrl);

    // Validate orderData structure
    if (!orderData || typeof orderData !== 'object') {
      console.error('❌ Stripe: orderData is missing or invalid:', orderData);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'orderData is required and must be a valid object',
          errorCode: 'invalidOrderData',
          provider: 'stripe'
        }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Validate form_data exists
    if (!orderData.form_data || typeof orderData.form_data !== 'object') {
      console.error('❌ Stripe: orderData.form_data is missing or invalid:', orderData.form_data);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'orderData.form_data is required and must be a valid object',
          errorCode: 'missingFormData',
          provider: 'stripe'
        }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Validate required form_data fields
    const requiredFormFields = ['email', 'fullName'];
    const missingFormFields = requiredFormFields.filter(field => 
      !orderData.form_data[field] || orderData.form_data[field] === ''
    );
    
    if (missingFormFields.length > 0) {
      console.error('❌ Stripe: Missing required form fields:', missingFormFields);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Missing required form fields: ${missingFormFields.join(', ')}`,
          errorCode: 'missingRequiredFormFields',
          provider: 'stripe'
        }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Validate required orderData fields
    const requiredOrderFields = ['total_price', 'currency', 'package_name'];
    const missingOrderFields = requiredOrderFields.filter(field => 
      orderData[field] === undefined || orderData[field] === null
    );
    
    if (missingOrderFields.length > 0) {
      console.error('❌ Stripe: Missing required order fields:', missingOrderFields);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Missing required order fields: ${missingOrderFields.join(', ')}`,
          errorCode: 'missingRequiredOrderFields',
          provider: 'stripe'
        }),
        { 
          status: 400,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error('❌ Stripe: Secret key not configured');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Stripe secret key not configured',
          errorCode: 'stripeConfigurationError',
          provider: 'stripe'
        }),
        { 
          status: 500,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    console.log('✅ Stripe: All validations passed, proceeding with order creation');

    // Initialize Stripe
    const Stripe = (await import('https://esm.sh/stripe@14.21.0')).default;
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Customer information
    const customerEmail = orderData.form_data.email;
    const customerName = orderData.form_data.fullName;

    // Check if customer already exists in Stripe
    console.log('🔍 Checking for existing Stripe customer:', customerEmail);
    let stripeCustomerId = null;
    try {
      const customers = await stripe.customers.list({
        email: customerEmail,
        limit: 1
      });
      
      if (customers.data.length > 0) {
        stripeCustomerId = customers.data[0].id;
        console.log('✅ Found existing Stripe customer:', stripeCustomerId);
      } else {
        // Create new customer
        console.log('➕ Creating new Stripe customer');
        const customer = await stripe.customers.create({
          email: customerEmail,
          name: customerName,
          metadata: {
            source: 'order_wizard',
            created_via: 'stripe_payment'
          }
        });
        stripeCustomerId = customer.id;
        console.log('✅ Created new Stripe customer:', stripeCustomerId);
      }
    } catch (customerError) {
      console.error('⚠️ Error handling Stripe customer:', customerError);
      // Continue without customer ID - not critical for payment
    }

    // ✅ FIX: Convert all monetary values to cents (integers) before database insertion
    const convertToCents = (value) => {
      if (typeof value === 'number') {
        return Math.round(value * 100);
      }
      if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : Math.round(parsed * 100);
      }
      return 0;
    };

    // Ensure all prices are converted to cents for database storage
    const totalPriceCents = convertToCents(orderData.total_price);
    const packagePriceCents = convertToCents(orderData.package_price || 0);
    const giftCreditAppliedCents = convertToCents((orderData.gift_credit_applied || 0) / 100); // Already in cents, convert back to base then to cents
    const discountAmountCents = convertToCents((orderData.discount_amount || 0) / 100); // Already in cents, convert back to base then to cents

    console.log('💰 Price conversions:', {
      original_total_price: orderData.total_price,
      total_price_cents: totalPriceCents,
      original_package_price: orderData.package_price,
      package_price_cents: packagePriceCents,
      original_gift_credit: orderData.gift_credit_applied,
      gift_credit_cents: giftCreditAppliedCents,
      original_discount: orderData.discount_amount,
      discount_cents: discountAmountCents
    });

    // Create order in database first (all prices now in cents)
    const orderInsertData = {
      ...orderData,
      total_price: totalPriceCents,
      package_price: packagePriceCents,
      gift_credit_applied: orderData.gift_credit_applied || 0, // Keep original value if already in cents
      discount_amount: orderData.discount_amount || 0, // Keep original value if already in cents
      payment_provider: 'stripe',
      status: 'pending',
      payment_status: 'pending',
      stripe_customer_id: stripeCustomerId
    };

    console.log('🟣 Stripe: Creating order with data (all prices in cents):', {
      ...orderInsertData,
      form_data: { email: orderInsertData.form_data.email?.substring(0, 5) + '***' }
    });

    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert([orderInsertData])
      .select()
      .single();

    if (orderError) {
      console.error('❌ Stripe: Error creating order in database:', orderError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Database error: ${orderError.message}`,
          errorCode: 'databaseError',
          provider: 'stripe'
        }),
        { 
          status: 500,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    console.log('✅ Stripe: Order created in database:', order.id);

    // Determine regional payment methods based on currency
    const paymentMethodTypes = ['card'];
    if (orderData.currency === 'eur') {
      paymentMethodTypes.push('sepa_debit', 'ideal', 'bancontact', 'giropay');
    } else if (orderData.currency === 'gbp') {
      paymentMethodTypes.push('bacs_debit');
    }

    // Session metadata for tracking
    const sessionMetadata = {
      order_id: order.id,
      package_value: orderData.package_value || '',
      customer_name: customerName,
      payment_provider: 'stripe',
      created_via: 'order_wizard'
    };

    // Line item for the order (price already in cents from database insert)
    const lineItem = {
      price_data: {
        currency: orderData.currency.toLowerCase(),
        product_data: {
          name: orderData.package_name || 'Custom Song Package',
          description: `${orderData.package_value} - Delivery: ${orderData.package_delivery_time || 'Standard'}`,
        },
        unit_amount: order.total_price // Use the cents value from database
      },
      quantity: 1
    };

    // Create Stripe checkout session (hosted mode only)
    const stripeUrl = 'https://api.stripe.com/v1/checkout/sessions';
    
    const sessionParams = new URLSearchParams();
    
    // Payment method types
    paymentMethodTypes.forEach((type, index) => {
      sessionParams.append(`payment_method_types[${index}]`, type);
    });
    
    // Line item parameters
    sessionParams.append('line_items[0][price_data][currency]', lineItem.price_data.currency);
    sessionParams.append('line_items[0][price_data][product_data][name]', lineItem.price_data.product_data.name);
    sessionParams.append('line_items[0][price_data][product_data][description]', lineItem.price_data.product_data.description);
    sessionParams.append('line_items[0][price_data][unit_amount]', lineItem.price_data.unit_amount.toString());
    sessionParams.append('line_items[0][quantity]', '1');
    
    // Session configuration
    sessionParams.append('mode', 'payment');
    sessionParams.append('expires_at', Math.floor((Date.now() / 1000) + (30 * 60)).toString()); // 30 minutes
    
    // Hosted mode URLs
    sessionParams.append('success_url', `${returnUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}&payment_status=success`);
    sessionParams.append('cancel_url', `${returnUrl.replace('success', 'cancel')}?order_id=${order.id}&payment_status=cancelled`);
    
    // Customer information
    if (stripeCustomerId) {
      sessionParams.append('customer', stripeCustomerId);
    } else {
      sessionParams.append('customer_email', customerEmail);
    }
    sessionParams.append('billing_address_collection', 'required');
    
    // Metadata
    Object.entries(sessionMetadata).forEach(([key, value]) => {
      sessionParams.append(`metadata[${key}]`, value);
    });
    
    // Allow promotion codes
    sessionParams.append('allow_promotion_codes', 'true');

    console.log('🟣 Stripe: Creating checkout session for redirect mode');

    const stripeResponse = await fetch(stripeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Idempotency-Key': `order-${order.id}-${Date.now()}`
      },
      body: sessionParams.toString(),
    });

    const responseText = await stripeResponse.text();
    console.log('🟣 Stripe API Response Status:', stripeResponse.status);
    console.log('🟣 Stripe API Response Text:', responseText);

    if (!stripeResponse.ok) {
      console.error('❌ Stripe API Error:', responseText);
      
      let errorMessage = `Stripe API error (${stripeResponse.status})`;
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      } catch (e) {
        errorMessage += `: ${responseText}`;
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          error: errorMessage,
          errorCode: 'stripeApiError',
          provider: 'stripe'
        }),
        { 
          status: 500,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const session = JSON.parse(responseText);
    console.log('✅ Stripe: Session created successfully:', {
      id: session.id,
      url: session.url ? 'Present' : 'Missing',
      status: session.status,
      expires_at: session.expires_at,
      payment_method_types: session.payment_method_types,
      customer: session.customer
    });

    // Validate that we got a checkout URL
    if (!session.url) {
      console.error('❌ Stripe: No checkout URL in session response');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Stripe did not return a checkout URL',
          errorCode: 'missingCheckoutUrl',
          provider: 'stripe'
        }),
        { 
          status: 500,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Update order with Stripe session details
    const updateData = {
      stripe_session_id: session.id,
      stripe_customer_id: session.customer || stripeCustomerId,
      session_expires_at: new Date(session.expires_at * 1000).toISOString(),
      payment_url: session.url
    };

    console.log('🟣 Stripe: Updating order with session details:', updateData);

    const { error: updateError } = await supabaseClient
      .from('orders')
      .update(updateData)
      .eq('id', order.id);

    if (updateError) {
      console.error('⚠️ Stripe: Error updating order with session details:', updateError);
      // Don't fail here - order was created, just log the error
    } else {
      console.log('✅ Stripe: Order updated with session details successfully');
    }

    const successResponse = {
      success: true,
      orderId: order.id,
      sessionId: session.id,
      paymentUrl: session.url,
      expiresAt: session.expires_at,
      paymentMethods: session.payment_method_types,
      customerId: session.customer || stripeCustomerId,
      provider: 'stripe'
    };

    console.log('🟣 Stripe: Returning success response:', successResponse);

    return new Response(
      JSON.stringify(successResponse),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('💥 Stripe: Fatal error:', error);
    
    const errorResponse = {
      success: false,
      error: error.message || 'Unknown error occurred',
      errorCode: 'orderCreationFailed',
      provider: 'stripe'
    };

    return new Response(
      JSON.stringify(errorResponse),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
