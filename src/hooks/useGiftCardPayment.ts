
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useGiftCardPayment = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      giftCardId, 
      returnUrl, 
      paymentProvider = 'smartbill' 
    }: { 
      giftCardId: string; 
      returnUrl?: string; 
      paymentProvider?: string;
    }) => {
      console.log(`Initiating ${paymentProvider} payment for gift card:`, giftCardId);
      
      // Route to the appropriate payment provider edge function
      const functionName = paymentProvider === 'stripe' 
        ? 'gift-card-stripe-payment'
        : 'gift-card-smartbill-payment';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { giftCardId, returnUrl }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      console.log('Payment response:', data);
      // Redirect to payment page
      if (data.paymentUrl || data.url) {
        const paymentUrl = data.paymentUrl || data.url;
        window.open(paymentUrl, '_blank');
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
