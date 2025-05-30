
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const PaymentCancel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <Navigation />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <XCircle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Payment Cancelled
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Your payment was cancelled. No charges were made to your account.
                  </p>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                  <p className="text-gray-700">
                    Don't worry! Your order is still saved and you can complete the payment later. 
                    If you experienced any issues during the payment process, please try again or contact our support team.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Link to="/order">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Try Payment Again
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline">
                      <Link to="/">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                      </Link>
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Need help? <Link to="/contact" className="text-purple-600 hover:underline">Contact our support team</Link>
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

export default PaymentCancel;
