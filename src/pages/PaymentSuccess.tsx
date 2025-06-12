
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, CreditCard, ArrowLeft, Mail, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const orderType = searchParams.get('type'); // 'quote' for quote requests
  const { t } = useLanguage();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isQuoteRequest = orderType === 'quote';

  useEffect(() => {
    const fetchOrderData = async () => {
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
        } else {
          setOrderData(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                {isQuoteRequest ? (
                  <FileText className="w-8 h-8 text-green-600" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                )}
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isQuoteRequest ? t('quoteRequestSuccess', 'Quote Request Submitted!') : t('orderSuccess', 'Order Completed!')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isQuoteRequest ? (
                <>
                  <div className="text-center space-y-4">
                    <p className="text-gray-600">
                      {t('quoteRequestSuccessMessage', 'Your quote request has been submitted successfully. We\'ll get back to you soon.')}
                    </p>
                    
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h3 className="font-semibold text-orange-800 mb-2">What happens next?</h3>
                      <ul className="text-sm text-orange-700 space-y-1 text-left">
                        <li>• Our team will review your requirements</li>
                        <li>• We'll prepare a personalized quote within 24-48 hours</li>
                        <li>• You'll receive an email with pricing and timeline details</li>
                        <li>• No payment is required until you approve the quote</li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center space-y-4">
                    <p className="text-gray-600">
                      {t('orderSuccessMessage', 'Your order has been created successfully. This uses demo data.')}
                    </p>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800 mb-2">What happens next?</h3>
                      <ul className="text-sm text-green-700 space-y-1 text-left">
                        <li>• You'll receive a confirmation email shortly</li>
                        <li>• Our team will start working on your personalized song</li>
                        <li>• Delivery within 3-5 business days</li>
                        <li>• High-quality MP3 and WAV files included</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {orderData && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Order Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Order ID:</strong> {orderData.order_number || orderData.id}</p>
                    <p><strong>Package:</strong> {orderData.package_name}</p>
                    <p><strong>Customer:</strong> {orderData.customer_name}</p>
                    <p><strong>Email:</strong> {orderData.customer_email}</p>
                    {orderData.total_amount && (
                      <p><strong>Amount:</strong> {(orderData.total_amount / 100).toFixed(2)} {orderData.currency}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link to="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/contact">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Us
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/history">
                      <FileText className="w-4 h-4 mr-2" />
                      Order History
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500 border-t pt-4">
                <p>Questions? Contact us at support@musicgift.ro or call +40 123 456 789</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
