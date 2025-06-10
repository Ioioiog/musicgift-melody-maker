
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DiscountEmailDelivery {
  id: string;
  discount_code_id?: string;
  discount_code: string;
  recipient_email: string;
  recipient_name?: string;
  email_type: 'manual' | 'auto_generated';
  delivery_status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'hard_bounced' | 'soft_bounced' | 'failed' | 'unsubscribed';
  brevo_message_id?: string;
  sent_at: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  bounce_reason?: string;
  engagement_score: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export const useDiscountEmailDeliveries = () => {
  const queryClient = useQueryClient();

  // Set up real-time subscription for email delivery updates
  useEffect(() => {
    const channel = supabase
      .channel('discount-email-deliveries-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'discount_email_deliveries'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Invalidate and refetch the query when data changes
          queryClient.invalidateQueries({ queryKey: ['discount-email-deliveries'] });
          queryClient.invalidateQueries({ queryKey: ['discount-email-delivery-stats'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['discount-email-deliveries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discount_email_deliveries')
        .select('*')
        .order('sent_at', { ascending: false });

      if (error) throw error;
      return data as DiscountEmailDelivery[];
    }
  });
};

export const useDiscountEmailDeliveryStats = () => {
  return useQuery({
    queryKey: ['discount-email-delivery-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discount_email_deliveries')
        .select('email_type, delivery_status, engagement_score');

      if (error) throw error;

      const stats = {
        total: data.length,
        manual: data.filter(d => d.email_type === 'manual').length,
        auto_generated: data.filter(d => d.email_type === 'auto_generated').length,
        sent: data.filter(d => d.delivery_status === 'sent').length,
        delivered: data.filter(d => d.delivery_status === 'delivered').length,
        opened: data.filter(d => d.delivery_status === 'opened').length,
        clicked: data.filter(d => d.delivery_status === 'clicked').length,
        bounced: data.filter(d => ['bounced', 'hard_bounced', 'soft_bounced'].includes(d.delivery_status)).length,
        failed: data.filter(d => d.delivery_status === 'failed').length,
        engagement_rate: data.length > 0 ? 
          Math.round((data.filter(d => d.engagement_score > 0).length / data.length) * 100) : 0,
      };

      return stats;
    }
  });
};

// Hook for manual refresh functionality
export const useRefreshEmailDeliveries = () => {
  const queryClient = useQueryClient();
  
  const refreshDeliveries = () => {
    queryClient.invalidateQueries({ queryKey: ['discount-email-deliveries'] });
    queryClient.invalidateQueries({ queryKey: ['discount-email-delivery-stats'] });
  };

  return { refreshDeliveries };
};
