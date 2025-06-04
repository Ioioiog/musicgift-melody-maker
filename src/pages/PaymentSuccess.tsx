
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Package, RefreshCw } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const { toast } = useToast();

  // Handle both 'orderId' and 'order' query parameters
  const orderId = searchParams.get('orderId') || searchParams.get('order');

  const fetchOrderDetails = async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        toast({
          title: 'Error loading order details',
          description: 'Unable to retrieve your order information.',
          variant: 'destructive'
        });
      } else {
        setOrderDetails(data);
        
        // Check if payment is confirmed
        if (data.payment_status === 'completed') {
          setPaymentConfirmed(true);
        } else if (data.payment_status === 'pending') {
          // If payment is still pending, poll for updates
          setTimeout(fetchOrderDetails, 3000); // Check again in 3 seconds
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50">
      <Navigation />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  {paymentConfirmed ? (
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  ) : (
                    <RefreshCw className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-spin" />
                  )}
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {paymentConfirmed ? 'Payment Successful!' : 'Processing Payment...'}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {paymentConfirmed 
                      ? 'Thank you for your payment. Your order has been confirmed.'
                      : 'We\'re confirming your payment. This should take just a moment.'
                    }
                  </p>
                </div>

                {orderDetails && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                    <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-mono">#{orderDetails.id.slice(0, 8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Package:</span>
                        <span>{orderDetails.package_name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold">{orderDetails.total_price} {orderDetails.currency || 'RON'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className={`capitalize font-semibold ${
                          paymentConfirmed ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {paymentConfirmed ? 'Completed' : orderDetails.payment_status}
                        </span>
                      </div>
                      {orderDetails.smartbill_invoice_id && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Invoice #:</span>
                          <span className="font-mono">{orderDetails.smartbill_invoice_id}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-gray-600">
                    {paymentConfirmed 
                      ? "We've received your payment and your order is now being processed. You'll receive an email confirmation shortly with all the details."
                      : "Please wait while we confirm your payment. You'll receive an email confirmation once it's processed."
                    }
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Link to="/">
                        <Home className="w-4 h-4 mr-2" />
                        Back to Home
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline">
                      <Link to="/packages">
                        <Package className="w-4 h-4 mr-2" />
                        View Packages
                      </Link>
                    </Button>
                    
                    {!paymentConfirmed && (
                      <Button 
                        variant="outline" 
                        onClick={fetchOrderDetails}
                        className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Status
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
