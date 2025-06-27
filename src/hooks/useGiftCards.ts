
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

export interface GiftCardDesign {
  id: string;
  name: string;
  theme: string;
  preview_image_url?: string;
  template_data: any;
  is_active: boolean;
}

export interface GiftCard {
  id: string;
  code: string;
  sender_user_id?: string;
  sender_name: string;
  sender_email: string;
  recipient_name: string;
  recipient_email: string;
  message_text?: string;
  audio_message_url?: string;
  currency: string;
  gift_amount?: number;
  amount_ron?: number;
  amount_eur?: number;
  package_type?: string;
  design_id?: string;
  delivery_date?: string;
  status: string;
  expires_at?: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

// Use Supabase's generated insert type
type GiftCardInsert = Database['public']['Tables']['gift_cards']['Insert'];
type GiftCardDesignInsert = Database['public']['Tables']['gift_card_designs']['Insert'];
type GiftCardDesignUpdate = Database['public']['Tables']['gift_card_designs']['Update'];

export const useGiftCardDesigns = () => {
  return useQuery({
    queryKey: ['gift-card-designs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gift_card_designs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GiftCardDesign[];
    },
  });
};

export const useCreateGiftCardDesign = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (designData: GiftCardDesignInsert) => {
      const { data, error } = await supabase
        .from('gift_card_designs')
        .insert(designData)
        .select()
        .single();

      if (error) throw error;
      return data as GiftCardDesign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-card-designs'] });
      toast({
        title: "Design Created",
        description: "Gift card design has been created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create gift card design. Please try again.",
        variant: "destructive",
      });
      console.error("Gift card design creation error:", error);
    },
  });
};

export const useUpdateGiftCardDesign = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, designData }: { id: string; designData: GiftCardDesignUpdate }) => {
      const { data, error } = await supabase
        .from('gift_card_designs')
        .update(designData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as GiftCardDesign;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-card-designs'] });
      toast({
        title: "Design Updated",
        description: "Gift card design has been updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update gift card design. Please try again.",
        variant: "destructive",
      });
      console.error("Gift card design update error:", error);
    },
  });
};

export const useDeleteGiftCardDesign = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // First check if the design is being used by any gift cards
      const { data: giftCards, error: checkError } = await supabase
        .from('gift_cards')
        .select('id, code')
        .eq('design_id', id)
        .limit(1);

      if (checkError) throw checkError;

      if (giftCards && giftCards.length > 0) {
        throw new Error('DESIGN_IN_USE');
      }

      const { error } = await supabase
        .from('gift_card_designs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-card-designs'] });
      toast({
        title: "Design Deleted",
        description: "Gift card design has been permanently deleted!",
      });
    },
    onError: (error: any) => {
      console.error("Gift card design deletion error:", error);
      
      if (error.message === 'DESIGN_IN_USE') {
        toast({
          title: "Cannot Delete Design",
          description: "This design is currently being used by existing gift cards. Please deactivate it instead or remove the gift cards first.",
          variant: "destructive",
        });
      } else if (error.code === '23503') {
        toast({
          title: "Cannot Delete Design",
          description: "This design is referenced by existing gift cards. Please deactivate it instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete gift card design. Please try again.",
          variant: "destructive",
        });
      }
    },
  });
};

export const useCreateGiftCard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (giftCardData: GiftCardInsert) => {
      const { data, error } = await supabase
        .from('gift_cards')
        .insert(giftCardData)
        .select()
        .single();

      if (error) throw error;
      return data as GiftCard;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gift-cards'] });
      toast({
        title: "Gift Card Created",
        description: "Your gift card has been created successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create gift card. Please try again.",
        variant: "destructive",
      });
      console.error("Gift card creation error:", error);
    },
  });
};

export const useGiftCardByCode = (code: string) => {
  return useQuery({
    queryKey: ['gift-card', code],
    queryFn: async () => {
      if (!code) return null;
      
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', code)
        .single();

      if (error) {
        // Don't throw for not found errors, return null instead
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data as GiftCard;
    },
    enabled: !!code && code.length > 0,
  });
};

export const useValidateGiftCard = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      // First, get the gift card with its redemption history
      const { data: giftCard, error: cardError } = await supabase
        .from('gift_cards')
        .select(`
          *,
          gift_redemptions(
            id,
            redeemed_amount,
            remaining_balance,
            redemption_date
          )
        `)
        .eq('code', code)
        .single();

      if (cardError) {
        if (cardError.code === 'PGRST116') {
          throw new Error('Gift card not found. Please check the code and try again.');
        }
        throw cardError;
      }

      // Check if gift card exists and basic validation
      if (!giftCard) {
        throw new Error('Gift card not found. Please check the code and try again.');
      }

      // Check if gift card has expired
      if (giftCard.expires_at && new Date(giftCard.expires_at) < new Date()) {
        throw new Error('This gift card has expired.');
      }

      // Check payment status - accept both 'completed' and 'paid'
      if (giftCard.payment_status !== 'completed' && giftCard.payment_status !== 'paid') {
        throw new Error('This gift card payment is not completed yet.');
      }

      // Check if gift card is fully redeemed
      if (giftCard.status === 'fully_redeemed') {
        throw new Error('This gift card has already been fully used.');
      }

      // Check if gift card is cancelled or expired
      if (giftCard.status === 'cancelled') {
        throw new Error('This gift card has been cancelled.');
      }

      if (giftCard.status === 'expired') {
        throw new Error('This gift card has expired.');
      }

      // Calculate remaining balance
      const originalAmount = giftCard.gift_amount || giftCard.amount_eur || giftCard.amount_ron || 0;
      const totalRedeemed = (giftCard.gift_redemptions || [])
        .reduce((sum: number, redemption: any) => sum + (redemption.redeemed_amount || 0), 0);
      const remainingBalance = originalAmount - totalRedeemed;

      // Check if there's any balance left
      if (remainingBalance <= 0) {
        // Update status to fully_redeemed if not already
        if (giftCard.status !== 'fully_redeemed') {
          await supabase
            .from('gift_cards')
            .update({ status: 'fully_redeemed' })
            .eq('id', giftCard.id);
        }
        throw new Error('This gift card has no remaining balance.');
      }

      // Return gift card with calculated remaining balance
      return {
        ...giftCard,
        remaining_balance: remainingBalance,
        total_redeemed: totalRedeemed
      } as GiftCard & { remaining_balance: number; total_redeemed: number };
    },
  });
};

export const useGiftCardBalance = (cardId: string) => {
  return useQuery({
    queryKey: ['gift-card-balance', cardId],
    queryFn: async () => {
      if (!cardId) return 0;
      
      const { data, error } = await supabase
        .rpc('get_gift_card_balance', { card_id: cardId });

      if (error) throw error;
      return data as number;
    },
    enabled: !!cardId,
  });
};
