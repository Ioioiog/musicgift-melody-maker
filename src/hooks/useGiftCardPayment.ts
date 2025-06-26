
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentWindowTracker {
  giftCardId?: string;
  paymentWindow?: Window | null;
}

let paymentTracker: PaymentWindowTracker = {};

export const useGiftCardPayment = () => {
  const { toast } = useToast();

  const trackPaymentWindow = (giftCardId: string, paymentWindow: Window) => {
    paymentTracker.giftCardId = giftCardId;
    paymentTracker.paymentWindow = paymentWindow;
    
    // Monitor when payment window closes
    const checkClosed = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(checkClosed);
        // Payment window closed - trigger status check
        window.dispatchEvent(new CustomEvent('paymentWindowClosed', {
          detail: { giftCardId }
        }));
      }
    }, 1000);
  };

  return useMutation({
    mutationFn: async ({ 
      giftCardData, 
      returnUrl, 
      paymentProvider = 'smartbill' 
    }: { 
      giftCardData: any; 
      returnUrl?: string; 
      paymentProvider?: string;
    }) => {
      console.log(`Initiating ${paymentProvider} payment for gift card data:`, giftCardData);
      
      // Route to the appropriate payment provider edge function
      const functionName = paymentProvider === 'stripe' 
        ? 'gift-card-stripe-payment'
        : 'gift-card-smartbill-payment';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { giftCardData, returnUrl }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      console.log('Payment response:', data);
      // Open payment page and track it
      if (data.paymentUrl || data.url) {
        const paymentUrl = data.paymentUrl || data.url;
        const paymentWindow = window.open(paymentUrl, '_blank');
        
        if (paymentWindow && data.giftCardId) {
          trackPaymentWindow(data.giftCardId, paymentWindow);
        }
        
        toast({
          title: "Payment Window Opened",
          description: "Complete your payment in the new tab. We'll automatically check the status once you're done.",
          duration: 5000
        });
      }
    },
    onError: (error) => {
      console.error('Gift card payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const getPaymentTracker = () => paymentTracker;
