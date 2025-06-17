
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseGiftCardsAdminParams {
  search?: string;
  status?: string;
  paymentStatus?: string;
}

export const useGiftCardsAdmin = (params: UseGiftCardsAdminParams = {}) => {
  return useQuery({
    queryKey: ['gift-cards-admin', params],
    queryFn: async () => {
      let query = supabase
        .from('gift_cards')
        .select(`
          *,
          gift_card_designs (
            template_data
          )
        `)
        .order('created_at', { ascending: false });

      // Apply search filter
      if (params.search) {
        query = query.or(
          `code.ilike.%${params.search}%,sender_name.ilike.%${params.search}%,sender_email.ilike.%${params.search}%,recipient_name.ilike.%${params.search}%,recipient_email.ilike.%${params.search}%`
        );
      }

      // Apply status filter
      if (params.status && params.status !== 'all') {
        query = query.eq('status', params.status);
      }

      // Apply payment status filter
      if (params.paymentStatus && params.paymentStatus !== 'all') {
        query = query.eq('payment_status', params.paymentStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Ensure all template data has standardized dimensions
      const processedData = data?.map(card => {
        // Access template_data from the nested gift_card_designs object
        const designData = card.gift_card_designs as any;
        const templateData = designData?.template_data;
        
        if (templateData && typeof templateData === 'object') {
          return {
            ...card,
            template_data: {
              ...templateData,
              canvasWidth: 400,
              canvasHeight: 250,
              elements: templateData.elements || []
            }
          };
        }
        
        return {
          ...card,
          template_data: {
            canvasWidth: 400,
            canvasHeight: 250,
            elements: []
          }
        };
      });
      
      return processedData;
    },
  });
};
