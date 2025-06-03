
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  gift_amount?: number;
  package_type?: string;
  design_id?: string;
  delivery_date?: string;
  status: string;
  expires_at?: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

// Create a proper type for gift card creation (excluding auto-generated fields)
export type GiftCardCreate = Omit<GiftCard, 'id' | 'code' | 'created_at' | 'updated_at'>;

export const useGiftCardDesigns = () => {
  return useQuery({
    queryKey: ['gift-card-designs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gift_card_designs')
        .select('*')
        .eq('is_active', true)
        .order('created_at');

      if (error) throw error;
      return data as GiftCardDesign[];
    },
  });
};

export const useCreateGiftCard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (giftCardData: GiftCardCreate) => {
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

      if (error) throw error;
      return data as GiftCard;
    },
    enabled: !!code,
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
