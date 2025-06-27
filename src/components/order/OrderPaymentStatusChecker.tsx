
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface OrderPaymentStatusCheckerProps {
  orderId?: string;
  provider: string;
  onClose: () => void;
}

const OrderPaymentStatusChecker: React.FC<OrderPaymentStatusCheckerProps> = ({
  orderId,
  provider,
  onClose
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'checking' | 'success' | 'failed' | 'cancelled'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;

    const checkPaymentStatus = async () => {
      if (!orderId) return;

      try {
        console.log('🔍 Checking payment status for order:', orderId);
        
        const { data: order, error } = await supabase
          .from('orders')
          .select('payment_status, status')
          .eq('id', orderId)
          .single();

        if (error) {
          console.error('❌ Error checking order status:', error);
          return;
        }

        console.log('📋 Order status:', order);

        if (order?.payment_status === 'completed' || order?.status === 'completed') {
          console.log('✅ Payment completed successfully');
          setStatus('success');
          setMessage(t('paymentSuccessful', 'Payment completed successfully!'));
          
          // Redirect to success page after a short delay
          setTimeout(() => {
            navigate(`/payment/success?orderId=${orderId}`);
          }, 2000);
        } else if (order?.payment_status === 'failed' || order?.status === 'failed') {
          console.log('❌ Payment failed');
          setStatus('failed');
          setMessage(t('paymentFailed', 'Payment failed. Please try again.'));
        }
      } catch (error) {
        console.error('💥 Error checking payment status:', error);
      }
    };

    // Start checking payment status every 3 seconds
    intervalId = setInterval(checkPaymentStatus, 3000);
    
    // Initial check
    checkPaymentStatus();

    // Set timeout to stop checking after 10 minutes
    timeoutId = setTimeout(() => {
      if (status === 'checking') {
        console.log('⏰ Payment status check timeout');
        setStatus('cancelled');
        setMessage(t('paymentTimeout', 'Payment verification timed out. Please check your email or contact support.'));
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [orderId, status, navigate, t]);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="w-8 h-8 animate-spin text-orange-400" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'failed':
      case 'cancelled':
        return <AlertCircle className="w-8 h-8 text-red-400" />;
      default:
        return <Loader2 className="w-8 h-8 animate-spin text-orange-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'checking':
        return t('paymentProcessing', `Your ${provider} payment is being processed. Please wait...`);
      case 'success':
        return message;
      case 'failed':
      case 'cancelled':
        return message;
      default:
        return t('paymentProcessing', 'Processing payment...');
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border border-white/30">
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          {getStatusIcon()}
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {status === 'checking' ? t('processingPayment', 'Processing Payment') : 
               status === 'success' ? t('paymentComplete', 'Payment Complete') :
               t('paymentIssue', 'Payment Issue')}
            </h3>
            <p className="text-white/80 text-sm">
              {getStatusMessage()}
            </p>
          </div>

          {status !== 'checking' && status !== 'success' && (
            <div className="flex gap-2">
              <Button
                onClick={onClose}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                {t('close', 'Close')}
              </Button>
              {status === 'failed' && (
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {t('tryAgain', 'Try Again')}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderPaymentStatusChecker;
