
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentProvider {
  id: string;
  provider_name: string;
  display_name: string;
  is_enabled: boolean;
  logo_url?: string;
  supported_currencies: string[];
  config: any;
  created_at: string;
  updated_at: string;
}

export const usePaymentProviders = () => {
  return useQuery({
    queryKey: ['payment-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_providers')
        .select('*')
        .order('created_at');
      
      if (error) throw error;
      return data as PaymentProvider[];
    }
  });
};

export const useEnabledPaymentProviders = () => {
  return useQuery({
    queryKey: ['enabled-payment-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_providers')
        .select('*')
        .eq('is_enabled', true)
        .order('created_at');
      
      if (error) throw error;
      return data as PaymentProvider[];
    }
  });
};

export const useUpdatePaymentProvider = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PaymentProvider> }) => {
      const { data, error } = await supabase
        .from('payment_providers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-providers'] });
      queryClient.invalidateQueries({ queryKey: ['enabled-payment-providers'] });
      toast({
        title: "Success",
        description: "Payment provider updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update payment provider",
        variant: "destructive",
      });
    }
  });
};
