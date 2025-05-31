
const NetopiaPayment = require('../lib/netopia');
const { supabase } = require('../lib/supabase');

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Webhook received from NETOPIA');
    console.log('Request body:', req.body);

    const { env_key, data } = req.body;

    if (!env_key || !data) {
      return res.status(400).json({ error: 'Missing required webhook data' });
    }

    // Initialize NETOPIA payment
    const netopia = new NetopiaPayment(
      process.env.NETOPIA_SIGNATURE,
      process.env.NETOPIA_PUBLIC_KEY,
      process.env.NETOPIA_PRIVATE_KEY,
      process.env.NETOPIA_TEST_MODE === 'true'
    );

    // Parse the IPN response
    const ipnData = await netopia.parseIPNResponse(data);
    console.log('Parsed IPN data:', JSON.stringify(ipnData, null, 2));

    // Extract payment information
    const orderId = ipnData.order?.$.id;
    const errorCode = ipnData.order?.mobilpay?.error?.$.code;
    const errorMessage = ipnData.order?.mobilpay?.error?._;
    const action = ipnData.order?.mobilpay?.$.action;
    const amount = ipnData.order?.mobilpay?.$.amount;

    if (!orderId) {
      throw new Error('Order ID not found in IPN response');
    }

    // Determine payment status based on error code and action
    let paymentStatus = 'failed';
    if (errorCode === '0' && action === 'confirmed') {
      paymentStatus = 'completed';
    } else if (errorCode === '0' && action === 'pending_auth') {
      paymentStatus = 'pending';
    }

    console.log(`Payment status for order ${orderId}: ${paymentStatus}`);

    // Find the order by netopia_order_id
    const { data: orders, error: findError } = await supabase
      .from('orders')
      .select('id')
      .eq('netopia_order_id', orderId)
      .single();

    if (findError) {
      console.error('Error finding order:', findError);
      throw new Error('Order not found');
    }

    // Update order status in Supabase
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        status: paymentStatus === 'completed' ? 'confirmed' : 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', orders.id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      throw new Error('Failed to update order status');
    }

    console.log(`Order ${orders.id} updated with status: ${paymentStatus}`);

    // Return success response to NETOPIA
    return res.status(200).send(`<?xml version="1.0" encoding="utf-8"?>
<crc>SUCCESS</crc>`);

  } catch (error) {
    console.error('Error processing webhook:', error);

    // Return error response to NETOPIA
    return res.status(200).send(`<?xml version="1.0" encoding="utf-8"?>
<crc>ERROR: ${error.message}</crc>`);
  }
};
