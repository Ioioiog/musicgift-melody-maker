
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useGiftCardPaymentPolling } from '@/hooks/useGiftCardPaymentPolling';

interface GiftPaymentStatusCheckerProps {
  giftCardId: string;
  onPaymentConfirmed: () => void;
  onManualCheck?: () => void;
}

const GiftPaymentStatusChecker: React.FC<GiftPaymentStatusCheckerProps> = ({
  giftCardId,
  onPaymentConfirmed,
  onManualCheck
}) => {
  const [showManualOptions, setShowManualOptions] = useState(false);
  const pollingStartedRef = useRef(false);
  
  const {
    isPolling,
    currentStatus,
    attempts,
    startPolling,
    stopPolling,
    checkGiftCardStatus
  } = useGiftCardPaymentPolling({
    giftCardId,
    onStatusChange: (status) => {
      if (status === 'completed') {
        onPaymentConfirmed();
      }
    },
    pollInterval: 5000,
    maxAttempts: 36
  });

  // Start polling only once when component mounts
  useEffect(() => {
    if (giftCardId && !pollingStartedRef.current) {
      pollingStartedRef.current = true;
      console.log('Starting payment status polling for gift card:', giftCardId);
      startPolling();
    }

    return () => {
      stopPolling();
      pollingStartedRef.current = false;
    };
  }, [giftCardId]); // Only depend on giftCardId

  // Show manual options after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowManualOptions(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array - only run once

  const handleManualCheck = async () => {
    const status = await checkGiftCardStatus();
    if (status === 'completed') {
      onPaymentConfirmed();
    } else {
      onManualCheck?.();
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          {isPolling ? (
            <>
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Checking Payment Status
                </h3>
                <p className="text-gray-600 mb-2">
                  We're verifying your payment with the payment processor...
                </p>
                <p className="text-sm text-gray-500">
                  Attempt {attempts + 1} - This usually takes 1-2 minutes
                </p>
              </div>
            </>
          ) : (
            <>
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Status Check Complete
                </h3>
                <p className="text-gray-600">
                  Current status: <span className="font-medium">{currentStatus}</span>
                </p>
              </div>
            </>
          )}

          {showManualOptions && (
            <div className="mt-6 space-y-3">
              <p className="text-sm text-gray-600">
                Payment taking longer than expected?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualCheck}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Check Now
                </Button>
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Don't worry - you'll receive an email confirmation once payment is processed, 
                even if you close this page.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GiftPaymentStatusChecker;
