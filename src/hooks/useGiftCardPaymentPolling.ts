
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useGiftCardSync } from './useGiftCardSync';

interface GiftCardPollingOptions {
  giftCardId?: string;
  onStatusChange?: (status: string) => void;
  pollInterval?: number;
  maxAttempts?: number;
}

export const useGiftCardPaymentPolling = ({
  giftCardId,
  onStatusChange,
  pollInterval = 5000, // 5 seconds
  maxAttempts = 36 // 3 minutes total
}: GiftCardPollingOptions = {}) => {
  const [isPolling, setIsPolling] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const { toast } = useToast();
  const { syncGiftCard } = useGiftCardSync();

  const checkGiftCardStatus = useCallback(async () => {
    if (!giftCardId) return null;

    try {
      const { data, error } = await supabase
        .from('gift_cards')
        .select('payment_status, smartbill_proforma_status')
        .eq('id', giftCardId)
        .single();

      if (error) throw error;

      return data.payment_status;
    } catch (error) {
      console.error('Error checking gift card status:', error);
      return null;
    }
  }, [giftCardId]);

  const startPolling = useCallback(async () => {
    if (!giftCardId || isPolling) return;

    console.log('Starting gift card payment polling for:', giftCardId);
    setIsPolling(true);
    setAttempts(0);

    const pollStatus = async () => {
      try {
        // First sync with SmartBill to get latest status
        await syncGiftCard(giftCardId);
        
        // Then check the updated status
        const status = await checkGiftCardStatus();
        
        if (status) {
          setCurrentStatus(status);
          
          if (status === 'completed') {
            console.log('Gift card payment completed!');
            setIsPolling(false);
            onStatusChange?.(status);
            toast({
              title: "Payment Confirmed!",
              description: "Your gift card has been processed and will be delivered shortly.",
            });
            return true; // Stop polling
          }
        }

        setAttempts(prev => prev + 1);
        return false; // Continue polling
      } catch (error) {
        console.error('Error during status polling:', error);
        setAttempts(prev => prev + 1);
        return false; // Continue polling despite error
      }
    };

    // Initial check
    const shouldStop = await pollStatus();
    if (shouldStop) return;

    // Set up interval for continued polling
    const intervalId = setInterval(async () => {
      const shouldStop = await pollStatus();
      
      if (shouldStop || attempts >= maxAttempts) {
        clearInterval(intervalId);
        setIsPolling(false);
        
        if (attempts >= maxAttempts) {
          toast({
            title: "Payment Status Check Timeout",
            description: "We're still processing your payment. You'll receive an email once it's completed.",
            variant: "default",
          });
        }
      }
    }, pollInterval);

    // Cleanup function
    return () => {
      clearInterval(intervalId);
      setIsPolling(false);
    };
  }, [giftCardId, isPolling, checkGiftCardStatus, syncGiftCard, onStatusChange, attempts, maxAttempts, pollInterval, toast]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    setAttempts(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    isPolling,
    currentStatus,
    attempts,
    startPolling,
    stopPolling,
    checkGiftCardStatus
  };
};
