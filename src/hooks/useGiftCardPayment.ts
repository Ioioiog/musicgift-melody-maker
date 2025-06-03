
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useGiftCardPayment = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ giftCardId, returnUrl }: { giftCardId: string; returnUrl?: string }) => {
      const { data, error } = await supabase.functions.invoke('gift-card-payment', {
        body: { giftCardId, returnUrl }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Redirect to payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    },
    onError: (error) => {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    },
  });
};
