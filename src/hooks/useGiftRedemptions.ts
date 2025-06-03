
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseGiftRedemptionsParams {
  search?: string;
  dateFilter?: string;
}

export const useGiftRedemptions = (params: UseGiftRedemptionsParams = {}) => {
  return useQuery({
    queryKey: ['gift-redemptions', params],
    queryFn: async () => {
      let query = supabase
        .from('gift_redemptions')
        .select(`
          *,
          gift_cards!inner(code, currency)
        `)
        .order('redemption_date', { ascending: false });

      // Apply search filter
      if (params.search) {
        query = query.filter('gift_cards.code', 'ilike', `%${params.search}%`);
      }

      // Apply date filter
      if (params.dateFilter && params.dateFilter !== 'all') {
        const now = new Date();
        let startDate = new Date();

        switch (params.dateFilter) {
          case 'today':
            startDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }

        query = query.gte('redemption_date', startDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to include gift card code and currency at the top level
      return data.map(redemption => ({
        ...redemption,
        gift_card_code: redemption.gift_cards.code,
        currency: redemption.gift_cards.currency
      }));
    },
  });
};
