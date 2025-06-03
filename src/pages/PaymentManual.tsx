
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Mail, CreditCard, Phone } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PaymentManual = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const orderId = searchParams.get('orderId');
  const invoiceId = searchParams.get('invoiceId');

  if (!orderId) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      backgroundImage: 'url(/lovable-uploads/65cd14fb-1e9c-4df4-a6e6-9e84a68b90f8.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* White glass overlay for glassmorphism effect */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

      <div className="relative z-10">
        <Navigation />
        
        <section className="pt-16 sm:pt-20 md:pt-24 py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-orange-800">
                  {t('manualPaymentRequired', 'Manual Payment Required')}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-800 mb-2">
                    {t('orderCreatedSuccessfully', 'Your order has been created successfully!')}
                  </h3>
                  <div className="text-sm text-orange-700 space-y-1">
                    <p><strong>{t('orderId', 'Order ID')}:</strong> {orderId}</p>
                    {invoiceId && (
                      <p><strong>{t('invoiceId', 'Invoice ID')}:</strong> {invoiceId}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">
                    {t('paymentInstructions', 'Payment Instructions')}
                  </h4>
                  <p className="text-gray-600">
                    {t('manualPaymentDesc', 'Our automatic payment system is temporarily unavailable. Please use one of the following methods to complete your payment:')}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email Contact */}
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <h5 className="font-medium">{t('emailPayment', 'Email Payment')}</h5>
                      </div>
                      <p className="text-sm text-gray-600">
                        {t('emailPaymentDesc', 'Send us an email with your order details and we\'ll provide payment instructions.')}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.location.href = `mailto:support@musicgift.ro?subject=Payment for Order ${orderId}&body=Hello, I need payment instructions for my order ${orderId}.`}
                        className="w-full"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        {t('sendEmail', 'Send Email')}
                      </Button>
                    </div>

                    {/* Phone Contact */}
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-green-600" />
                        <h5 className="font-medium">{t('phonePayment', 'Phone Payment')}</h5>
                      </div>
                      <p className="text-sm text-gray-600">
                        {t('phonePaymentDesc', 'Call us directly to complete your payment over the phone.')}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.location.href = 'tel:+40744778792'}
                        className="w-full"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        {t('callNow', 'Call Now')}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {t('whatHappensNext', 'What happens next?')}
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• {t('contactUsStep', 'Contact us using one of the methods above')}</li>
                    <li>• {t('provideOrderStep', 'Provide your order ID for quick processing')}</li>
                    <li>• {t('receiveInstructionsStep', 'Receive secure payment instructions')}</li>
                    <li>• {t('confirmationStep', 'Get confirmation once payment is processed')}</li>
                  </ul>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/')}
                  >
                    {t('returnHome', 'Return Home')}
                  </Button>
                  <Button 
                    onClick={() => navigate('/order')}
                  >
                    {t('newOrder', 'Place New Order')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default PaymentManual;
