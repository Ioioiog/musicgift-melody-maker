
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Gift, Mail } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const GiftPaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentStatus = searchParams.get('payment');

  useEffect(() => {
    // Could add analytics tracking here
    if (paymentStatus === 'success') {
      console.log('Gift card payment successful');
    }
  }, [paymentStatus]);

  if (paymentStatus !== 'success') {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-lg">
              <Gift className="w-6 h-6 text-purple-600" />
              <span>Your gift card has been created successfully</span>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-lg">
              <Mail className="w-6 h-6 text-blue-600" />
              <span>The recipient will receive their gift card email shortly</span>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-green-700 space-y-1 text-left">
              <li>• The recipient will receive an email with their gift card details</li>
              <li>• They can redeem it anytime before the expiration date</li>
              <li>• You'll receive a confirmation email with the purchase details</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/gift')}
            >
              Send Another Gift
            </Button>
            <Button 
              onClick={() => navigate('/')}
            >
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GiftPaymentSuccess;
