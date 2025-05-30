
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, CreditCard, Mail } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PaymentError = () => {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('errorCode');
  const errorMessage = searchParams.get('errorMessage');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <Navigation />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Payment Failed
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Unfortunately, there was an issue processing your payment.
                  </p>
                </div>

                {(errorCode || errorMessage) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 text-left">
                    <h3 className="font-semibold text-red-800 mb-2">Error Details</h3>
                    {errorCode && (
                      <p className="text-sm text-red-700 mb-1">
                        <strong>Error Code:</strong> {errorCode}
                      </p>
                    )}
                    {errorMessage && (
                      <p className="text-sm text-red-700">
                        <strong>Message:</strong> {errorMessage}
                      </p>
                    )}
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">What can you do?</h3>
                  <ul className="text-left text-gray-700 space-y-2 text-sm">
                    <li>• Check your card details and try again</li>
                    <li>• Ensure you have sufficient funds in your account</li>
                    <li>• Try using a different payment method</li>
                    <li>• Contact your bank if the problem persists</li>
                    <li>• Reach out to our support team for assistance</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Link to="/order">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Try Again
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline">
                      <Link to="/contact">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Support
                      </Link>
                    </Button>
                  </div>
                  
                  <Button asChild variant="ghost">
                    <Link to="/">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Home
                    </Link>
                  </Button>
                  
                  <p className="text-sm text-gray-500">
                    No charges were made to your account due to this error.
                  </p>
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

export default PaymentError;
