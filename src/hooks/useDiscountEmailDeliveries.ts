
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DiscountEmailDelivery {
  id: string;
  discount_code_id?: string;
  discount_code: string;
  recipient_email: string;
  recipient_name?: string;
  email_type: 'manual' | 'auto_generated';
  delivery_status: 'sent' | 'delivered' | 'bounced' | 'failed';
  brevo_message_id?: string;
  sent_at: string;
  delivered_at?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export const useDiscountEmailDeliveries = () => {
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
        .select('email_type, delivery_status');

      if (error) throw error;

      const stats = {
        total: data.length,
        manual: data.filter(d => d.email_type === 'manual').length,
        auto_generated: data.filter(d => d.email_type === 'auto_generated').length,
        sent: data.filter(d => d.delivery_status === 'sent').length,
        delivered: data.filter(d => d.delivery_status === 'delivered').length,
        bounced: data.filter(d => d.delivery_status === 'bounced').length,
        failed: data.filter(d => d.delivery_status === 'failed').length,
      };

      return stats;
    }
  });
};
