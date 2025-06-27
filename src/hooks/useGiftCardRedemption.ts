
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: RedeemGiftCardParams) => {
      // Start a transaction to ensure atomicity
      const { data: redemptionData, error: redemptionError } = await supabase
        .from('gift_redemptions')
        .insert({
          gift_card_id: params.giftCardId,
          redeemed_amount: params.redeemAmount,
          remaining_balance: params.remainingBalance,
          order_id: params.orderId,
        })
        .select()
        .single();

      if (redemptionError) throw redemptionError;

      // Determine the new status based on remaining balance
      let newStatus = 'active';
      if (params.remainingBalance === 0) {
        newStatus = 'fully_redeemed';
      } else if (params.remainingBalance > 0) {
        newStatus = 'partially_redeemed';
      }

      // Update gift card status
      const { error: updateError } = await supabase
        .from('gift_cards')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.giftCardId);

      if (updateError) throw updateError;

      return redemptionData;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gift-card', variables.giftCardId] });
      queryClient.invalidateQueries({ queryKey: ['gift-card-balance', variables.giftCardId] });
      
      const statusMessage = variables.remainingBalance === 0 ? 
        'Gift card fully redeemed!' : 
        `Gift card partially redeemed! Remaining balance: ${variables.remainingBalance}`;
      
      toast({
        title: "Gift Card Applied!",
        description: statusMessage,
      });
    },
    onError: (error: any) => {
      console.error('Gift card redemption error:', error);
      
      let errorMessage = "Failed to apply gift card. Please try again.";
      
      // Handle specific error cases
      if (error.message?.includes('exceeds available balance')) {
        errorMessage = "The redemption amount exceeds the available gift card balance.";
      } else if (error.message?.includes('violates row-level security')) {
        errorMessage = "You don't have permission to redeem this gift card.";
      }
      
      toast({
        title: "Redemption Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
