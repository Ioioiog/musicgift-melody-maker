
import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseGiftCardPaymentPollingProps {
  giftCardId: string;
  onStatusChange?: (status: string) => void;
  pollInterval?: number;
  maxAttempts?: number;
}

export const useGiftCardPaymentPolling = ({
  giftCardId,
  onStatusChange,
  pollInterval = 5000,
  maxAttempts = 36
}: UseGiftCardPaymentPollingProps) => {
  const [isPolling, setIsPolling] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>('pending');
  const [attempts, setAttempts] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();
  const hasCompletedRef = useRef(false);

  const checkGiftCardStatus = useCallback(async () => {
    try {
      console.log(`Checking gift card status for: ${giftCardId}`);
      
      // First try to sync with SmartBill
      const { error: syncError } = await supabase.functions.invoke('gift-card-smartbill-sync', {
        body: { giftCardId }
      });

      if (syncError) {
        console.error('SmartBill sync error:', syncError);
      }

      // Then check the gift card status
      const { data: giftCard, error } = await supabase
        .from('gift_cards')
        .select('payment_status, status')
        .eq('id', giftCardId)
        .single();

      if (error) {
        console.error('Error checking gift card:', error);
        return 'error';
      }

      console.log('Current gift card status:', {
        payment_status: giftCard.payment_status,
        status: giftCard.status
      });

      // FIXED: Accept both 'paid' and 'completed' as successful payment status
      const isPaymentComplete = giftCard.payment_status === 'paid' || giftCard.payment_status === 'completed';
      
      if (isPaymentComplete && giftCard.status === 'active') {
        return 'completed';
      }

      return giftCard.payment_status || 'pending';

    } catch (error) {
      console.error('Status check error:', error);
      return 'error';
    }
  }, [giftCardId]);

  const startPolling = useCallback(() => {
    if (isPolling || hasCompletedRef.current) return;

    console.log(`Starting payment polling for gift card: ${giftCardId}`);
    setIsPolling(true);
    setAttempts(0);

    const poll = async () => {
      try {
        const status = await checkGiftCardStatus();
        setCurrentStatus(status);
        
        const currentAttempt = attempts + 1;
        setAttempts(currentAttempt);

        console.log(`Poll attempt ${currentAttempt}: status = ${status}`);

        if (status === 'completed') {
          console.log('Payment completed! Stopping polling.');
          hasCompletedRef.current = true;
          setIsPolling(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          onStatusChange?.(status);
          return;
        }

        if (currentAttempt >= maxAttempts) {
          console.log('Max polling attempts reached');
          setIsPolling(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return;
        }

      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    // Initial check
    poll();

    // Set up interval for subsequent checks
    intervalRef.current = setInterval(poll, pollInterval);

  }, [giftCardId, isPolling, attempts, maxAttempts, pollInterval, checkGiftCardStatus, onStatusChange]);

  const stopPolling = useCallback(() => {
    console.log('Stopping payment polling');
    setIsPolling(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  return {
    isPolling,
    currentStatus,
    attempts,
    startPolling,
    stopPolling,
    checkGiftCardStatus
  };
};
