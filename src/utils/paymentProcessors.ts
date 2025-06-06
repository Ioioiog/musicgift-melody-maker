
import { supabase } from '@/integrations/supabase/client';

export interface PaymentProcessorResponse {
  success: boolean;
  orderId?: string;
  paymentUrl?: string;
  error?: string;
  provider: string;
}

/**
 * Process a payment using Revolut
 */
export async function processRevolutPayment(orderData: any): Promise<PaymentProcessorResponse> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/revolut-create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        orderData,
        returnUrl: `${window.location.origin}/payment-success`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Revolut payment error:', errorData);
      return {
        success: false,
        error: errorData.error || 'Failed to create Revolut payment',
        provider: 'revolut'
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      orderId: data.orderId,
      paymentUrl: data.paymentUrl,
      provider: 'revolut'
    };
  } catch (error) {
    console.error('Revolut payment process error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during payment processing',
      provider: 'revolut'
    };
  }
}

/**
 * Process a payment using Stripe
 */
export async function processStripePayment(orderData: any): Promise<PaymentProcessorResponse> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        orderData,
        returnUrl: `${window.location.origin}/payment-success`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Failed to create Stripe payment',
        provider: 'stripe'
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      orderId: data.orderId,
      paymentUrl: data.paymentUrl,
      provider: 'stripe'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during payment processing',
      provider: 'stripe'
    };
  }
}

/**
 * Process a payment using SmartBill (Netopia)
 */
export async function processSmartBillPayment(orderData: any): Promise<PaymentProcessorResponse> {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .insert([{ ...orderData, payment_provider: 'smartbill' }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/smartbill-create-proforma`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ orderData: order }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Failed to create SmartBill payment',
        provider: 'smartbill'
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      orderId: order.id,
      paymentUrl: data.url,
      provider: 'smartbill'
    };
  } catch (error) {
    console.error('SmartBill payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during payment processing',
      provider: 'smartbill'
    };
  }
}

/**
 * Process a payment based on the selected provider
 */
export async function processPayment(orderData: any, provider: string): Promise<PaymentProcessorResponse> {
  switch (provider) {
    case 'revolut':
      return processRevolutPayment(orderData);
    case 'stripe':
      return processStripePayment(orderData);
    case 'smartbill':
      return processSmartBillPayment(orderData);
    default:
      return {
        success: false,
        error: `Unknown payment provider: ${provider}`,
        provider
      };
  }
}
