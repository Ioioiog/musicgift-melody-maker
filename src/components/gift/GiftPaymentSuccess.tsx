
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Gift, Mail, Loader2, AlertCircle } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const GiftPaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [giftCardData, setGiftCardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const paymentStatus = searchParams.get('payment');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (paymentStatus !== 'success') {
        setIsVerifying(false);
        return;
      }

      try {
        console.log('Verifying payment with session_id:', sessionId);
        
        if (sessionId) {
          // For Stripe payments, find gift card by session ID
          const { data: giftCard, error: giftCardError } = await supabase
            .from('gift_cards')
            .select('*')
            .eq('stripe_session_id', sessionId)
            .single();

          if (giftCardError) {
            console.error('Error finding gift card:', giftCardError);
            setError('Gift card not found');
            setIsVerifying(false);
            return;
          }

          console.log('Found gift card:', giftCard);
          
          // Check if payment is actually completed
          if (giftCard.payment_status === 'completed') {
            setPaymentVerified(true);
            setGiftCardData(giftCard);
          } else if (giftCard.payment_status === 'pending') {
            // Payment still pending, could be processing
            setError('Payment is still being processed. Please check back in a few minutes.');
          } else {
            setError('Payment was not completed successfully');
          }
        } else {
          // Fallback: check for recently completed gift cards for the current user
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            const { data: recentGiftCards, error: recentError } = await supabase
              .from('gift_cards')
              .select('*')
              .eq('sender_user_id', user.id)
              .eq('payment_status', 'completed')
              .order('created_at', { ascending: false })
              .limit(1);

            if (recentError) {
              console.error('Error checking recent gift cards:', recentError);
              setError('Unable to verify payment');
            } else if (recentGiftCards && recentGiftCards.length > 0) {
              setPaymentVerified(true);
              setGiftCardData(recentGiftCards[0]);
            } else {
              setError('No completed payment found');
            }
          } else {
            setError('Unable to verify payment - please sign in');
          }
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setError('Unable to verify payment status');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [paymentStatus, sessionId]);

  if (paymentStatus !== 'success') {
    return null;
  }

  if (isVerifying) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">Verifying Payment</h3>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-red-800">Payment Verification Failed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-gray-700">{error}</p>
            
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/gift')}
              >
                Try Again
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
  }

  if (!paymentVerified || !giftCardData) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-yellow-600" />
            <h3 className="text-xl font-semibold mb-2">Payment Not Verified</h3>
            <p className="text-gray-600">We couldn't verify your payment. Please contact support if you believe this is an error.</p>
          </CardContent>
        </Card>
      </div>
    );
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
              <span>Gift card {giftCardData.code} has been created successfully</span>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-lg">
              <Mail className="w-6 h-6 text-blue-600" />
              <span>The recipient will receive their gift card email shortly</span>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Gift Card Details</h3>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>Code:</strong> {giftCardData.code}</p>
              <p><strong>Amount:</strong> {giftCardData.gift_amount} {giftCardData.currency}</p>
              <p><strong>Recipient:</strong> {giftCardData.recipient_email}</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
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
