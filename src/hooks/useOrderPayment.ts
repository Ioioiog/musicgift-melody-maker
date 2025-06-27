
import { useState, useCallback, useRef } from 'react';

interface PaymentWindow {
  window: Window;
  provider: string;
  orderId?: string;
}

export const useOrderPayment = () => {
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState<string>('');
  const paymentWindowRef = useRef<PaymentWindow | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const openPaymentWindow = useCallback((paymentUrl: string, provider: string, orderId?: string) => {
    console.log(`🔗 Opening ${provider} payment in new tab:`, paymentUrl);
    
    // Open payment URL in new tab
    const paymentWindow = window.open(paymentUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    
    if (!paymentWindow) {
      throw new Error('Payment window was blocked by popup blocker. Please allow popups for this site.');
    }

    // Store payment window reference
    paymentWindowRef.current = {
      window: paymentWindow,
      provider,
      orderId
    };

    setIsPaymentProcessing(true);
    setPaymentProvider(provider);

    // Start checking if payment window is closed
    checkIntervalRef.current = setInterval(() => {
      if (paymentWindow.closed) {
        console.log(`💳 ${provider} payment window closed`);
        setIsPaymentProcessing(false);
        
        // Dispatch custom event to trigger status check
        window.dispatchEvent(new CustomEvent('payment-window-closed', {
          detail: { provider, orderId }
        }));
        
        // Clear interval
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
        
        // Clear window reference
        paymentWindowRef.current = null;
      }
    }, 1000);

    return paymentWindow;
  }, []);

  const closePaymentWindow = useCallback(() => {
    if (paymentWindowRef.current?.window && !paymentWindowRef.current.window.closed) {
      paymentWindowRef.current.window.close();
    }
    
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
    
    setIsPaymentProcessing(false);
    setPaymentProvider('');
    paymentWindowRef.current = null;
  }, []);

  return {
    isPaymentProcessing,
    paymentProvider,
    openPaymentWindow,
    closePaymentWindow
  };
};
