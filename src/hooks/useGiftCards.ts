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
        .eq('is_active', true)
        .order('created_at');

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
