
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
    console.log('🟣 Stripe Create Payment: Starting enhanced process');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Parse and validate request body with comprehensive error handling
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

    // Validate request structure with detailed logging
    if (!requestBody || typeof requestBody !== 'object') {
      console.error('❌ Stripe: Request body is not a valid object:', requestBody);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Request body must be a valid object',
          errorCode: 'invalidRequestStructure',
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

    const { orderData, returnUrl } = requestBody;
    console.log('🟣 Stripe: Extracted orderData:', JSON.stringify(orderData, null, 2));
    console.log('🟣 Stripe: Return URL:', returnUrl);

    // Comprehensive orderData validation
    if (!orderData) {
      console.error('❌ Stripe: orderData is missing from request');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'orderData is required but was not provided',
          errorCode: 'missingOrderData',
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

    if (typeof orderData !== 'object') {
      console.error('❌ Stripe: orderData is not an object:', typeof orderData);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'orderData must be an object',
          errorCode: 'invalidOrderDataType',
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

    // Critical form_data validation with detailed error reporting
    if (!orderData.form_data) {
      console.error('❌ Stripe: orderData.form_data is missing:', orderData);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'orderData.form_data is required but was not provided',
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

    if (typeof orderData.form_data !== 'object') {
      console.error('❌ Stripe: orderData.form_data is not an object:', typeof orderData.form_data);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'orderData.form_data must be an object',
          errorCode: 'invalidFormDataType',
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

    console.log('🟣 Stripe: form_data contents:', JSON.stringify(orderData.form_data, null, 2));

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

    // Create order in database first - ensure payment_provider is set to 'stripe'
    const orderInsertData = {
      ...orderData,
      payment_provider: 'stripe',
      status: 'pending',
      payment_status: 'pending'
    };

    console.log('🟣 Stripe: Creating order with data:', JSON.stringify(orderInsertData, null, 2));

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

    // Enhanced customer information
    const customerEmail = orderData.form_data.email;
    const customerName = orderData.form_data.fullName;

    // Determine regional payment methods based on currency
    const paymentMethodTypes = ['card'];
    if (orderData.currency === 'eur') {
      paymentMethodTypes.push('sepa_debit', 'ideal', 'bancontact', 'giropay');
    } else if (orderData.currency === 'gbp') {
      paymentMethodTypes.push('bacs_debit');
    }

    // Enhanced metadata for better tracking
    const sessionMetadata = {
      order_id: order.id,
      package_value: orderData.package_value || '',
      customer_name: customerName,
      payment_provider: 'stripe',
      created_via: 'order_wizard'
    };

    // Enhanced line item with better product description
    const lineItem = {
      price_data: {
        currency: orderData.currency.toLowerCase(),
        product_data: {
          name: orderData.package_name || 'Custom Song Package',
          description: `${orderData.package_value} - Delivery: ${orderData.package_delivery_time || 'Standard'}`,
          metadata: {
            package_type: orderData.package_value || '',
            includes: orderData.package_includes ? JSON.stringify(orderData.package_includes) : ''
          }
        },
        unit_amount: orderData.total_price
      },
      quantity: 1
    };

    // Create Stripe checkout session with enhanced parameters
    const stripeUrl = 'https://api.stripe.com/v1/checkout/sessions';
    
    const sessionParams = new URLSearchParams();
    
    // Core session parameters
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
    
    // Customer information
    sessionParams.append('customer_email', customerEmail);
    sessionParams.append('billing_address_collection', 'required');
    
    // Enhanced URLs with more parameters
    sessionParams.append('success_url', `${returnUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}&payment_status=success`);
    sessionParams.append('cancel_url', `${returnUrl.replace('success', 'cancel')}?order_id=${order.id}&payment_status=cancelled`);
    
    // Metadata
    Object.entries(sessionMetadata).forEach(([key, value]) => {
      sessionParams.append(`metadata[${key}]`, value);
    });
    
    // Allow promotion codes
    sessionParams.append('allow_promotion_codes', 'true');
    
    // Automatic tax calculation (if enabled in Stripe)
    sessionParams.append('automatic_tax[enabled]', 'false');

    console.log('🟣 Stripe: Creating enhanced checkout session with params:', sessionParams.toString());

    const stripeResponse = await fetch(stripeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Idempotency-Key': `order-${order.id}-${Date.now()}` // Prevent duplicate sessions
      },
      body: sessionParams.toString(),
    });

    const responseText = await stripeResponse.text();
    console.log('🟣 Stripe API Response Status:', stripeResponse.status);
    console.log('🟣 Stripe API Response Text:', responseText);

    if (!stripeResponse.ok) {
      console.error('❌ Stripe API Error:', responseText);
      
      // Parse Stripe error for better user feedback
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
    console.log('✅ Stripe: Enhanced session created successfully:', {
      id: session.id,
      url: session.url ? 'Present' : 'Missing',
      status: session.status,
      expires_at: session.expires_at,
      payment_method_types: session.payment_method_types
    });

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

    // Update order with enhanced Stripe session details
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        stripe_session_id: session.id,
        payment_url: session.url,
        session_expires_at: new Date(session.expires_at * 1000).toISOString(),
        supported_payment_methods: session.payment_method_types
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('⚠️ Stripe: Error updating order with session details:', updateError);
      // Don't throw here as the payment session was created successfully
    } else {
      console.log('✅ Stripe: Order updated with enhanced session details');
    }

    const successResponse = {
      success: true,
      orderId: order.id,
      paymentUrl: session.url,
      sessionId: session.id,
      expiresAt: session.expires_at,
      paymentMethods: session.payment_method_types,
      provider: 'stripe'
    };

    console.log('🟣 Stripe: Returning enhanced success response:', successResponse);

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
