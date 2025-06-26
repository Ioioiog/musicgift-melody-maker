
import { useState, useEffect, useCallback, useRef } from 'react';
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
  
  // Use refs to manage interval and prevent multiple polling sessions
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const attemptsRef = useRef(0);
  const isPollingRef = useRef(false);

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

  const stopPolling = useCallback(() => {
    console.log('Stopping gift card payment polling');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsPolling(false);
    isPollingRef.current = false;
    setAttempts(0);
    attemptsRef.current = 0;
  }, []);

  const startPolling = useCallback(async () => {
    if (!giftCardId || isPollingRef.current) {
      console.log('Polling already active or no gift card ID');
      return;
    }

    console.log('Starting gift card payment polling for:', giftCardId);
    
    // Prevent multiple polling sessions
    isPollingRef.current = true;
    setIsPolling(true);
    setAttempts(0);
    attemptsRef.current = 0;

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
            stopPolling();
            onStatusChange?.(status);
            toast({
              title: "Payment Confirmed!",
              description: "Your gift card has been processed and will be delivered shortly.",
            });
            return true; // Stop polling
          }
        }

        attemptsRef.current += 1;
        setAttempts(attemptsRef.current);
        
        // Check if we've reached max attempts
        if (attemptsRef.current >= maxAttempts) {
          console.log('Max polling attempts reached');
          stopPolling();
          toast({
            title: "Payment Status Check Timeout",
            description: "We're still processing your payment. You'll receive an email once it's completed.",
            variant: "default",
          });
          return true; // Stop polling
        }
        
        return false; // Continue polling
      } catch (error) {
        console.error('Error during status polling:', error);
        attemptsRef.current += 1;
        setAttempts(attemptsRef.current);
        
        if (attemptsRef.current >= maxAttempts) {
          stopPolling();
        }
        
        return false; // Continue polling despite error
      }
    };

    // Initial check
    const shouldStop = await pollStatus();
    if (shouldStop) return;

    // Set up interval for continued polling - only if not already set
    if (!intervalRef.current) {
      intervalRef.current = setInterval(async () => {
        const shouldStop = await pollStatus();
        
        if (shouldStop) {
          stopPolling();
        }
      }, pollInterval);
    }
  }, [giftCardId, checkGiftCardStatus, syncGiftCard, onStatusChange, maxAttempts, pollInterval, toast, stopPolling]);

  // Cleanup on unmount or when dependencies change
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPollingRef.current = false;
    };
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
