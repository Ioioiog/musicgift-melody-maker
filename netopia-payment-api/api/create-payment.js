
const NetopiaPayment = require('../lib/netopia');
const { supabase } = require('../lib/supabase');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      orderId,
      amount,
      currency = 'RON',
      customerEmail,
      customerName,
      description
    } = req.body;

    // Validate required fields
    if (!orderId || !amount || !customerEmail || !customerName) {
      return res.status(400).json({
        error: 'Missing required fields: orderId, amount, customerEmail, customerName'
      });
    }

    console.log('Creating payment for order:', orderId, 'amount:', amount);

    // Initialize NETOPIA payment
    const netopia = new NetopiaPayment(
      process.env.NETOPIA_SIGNATURE,
      process.env.NETOPIA_PUBLIC_KEY,
      process.env.NETOPIA_PRIVATE_KEY,
      process.env.NETOPIA_TEST_MODE === 'true'
    );

    // Create payment request
    const paymentRequest = netopia.createPaymentRequest({
      orderId,
      amount,
      currency,
      customerEmail,
      customerName,
      description,
      returnUrl: `https://www.musicgift.ro/payment/success?orderId=${orderId}`,
      confirmUrl: `${req.headers.origin || 'https://your-vercel-app.vercel.app'}/api/webhook`
    });

    if (!paymentRequest.success) {
      throw new Error(paymentRequest.error || 'Failed to create payment request');
    }

    // Update order in Supabase
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'pending',
        netopia_order_id: paymentRequest.netopiaOrderId,
        payment_id: paymentRequest.netopiaOrderId,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
      throw new Error('Failed to update order in database');
    }

    console.log('Payment request created successfully:', paymentRequest.netopiaOrderId);

    // Return response with CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return res.status(200).json({
      success: true,
      paymentUrl: paymentRequest.paymentUrl,
      formData: paymentRequest.formData,
      netopiaOrderId: paymentRequest.netopiaOrderId,
      signature: paymentRequest.signature
    });

  } catch (error) {
    console.error('Error in create-payment API:', error);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
};
