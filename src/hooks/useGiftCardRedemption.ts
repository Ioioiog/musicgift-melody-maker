
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface RedeemGiftCardParams {
  giftCardId: string;
  packageValue: string;
  packageName: string;
  redeemAmount: number;
  remainingBalance: number;
  orderId?: string;
}

export const useGiftCardRedemption = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: RedeemGiftCardParams) => {
      const { data, error } = await supabase
        .from('gift_redemptions')
        .insert({
          gift_card_id: params.giftCardId,
          redeemed_amount: params.redeemAmount,
          remaining_balance: params.remainingBalance,
          order_id: params.orderId,
        })
        .select()
        .single();

      if (error) throw error;

      // Update gift card status if fully redeemed
      if (params.remainingBalance === 0) {
        const { error: updateError } = await supabase
          .from('gift_cards')
          .update({ status: 'used' })
          .eq('id', params.giftCardId);

        if (updateError) throw updateError;
      }

      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gift-card', variables.giftCardId] });
      queryClient.invalidateQueries({ queryKey: ['gift-card-balance', variables.giftCardId] });
      
      toast({
        title: "Gift Card Applied!",
        description: `Successfully applied ${variables.redeemAmount} ${variables.remainingBalance > 0 ? `(${variables.remainingBalance} remaining)` : ''}`,
      });
    },
    onError: (error) => {
      console.error('Gift card redemption error:', error);
      toast({
        title: "Redemption Failed",
        description: "Failed to apply gift card. Please try again.",
        variant: "destructive",
      });
    },
  });
};
