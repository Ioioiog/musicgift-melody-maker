
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DiscountCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount: number;
  maximum_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DiscountValidation {
  is_valid: boolean;
  discount_amount: number;
  discount_type: string;
  error_message: string;
}

export const useValidateDiscountCode = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ code, orderTotal }: { code: string; orderTotal: number }) => {
      console.log('🎫 Validating discount code:', { code, orderTotal });
      
      // Convert order total to cents for database function
      const orderTotalCents = Math.round(orderTotal * 100);
      
      const { data, error } = await supabase.rpc('validate_discount_code', {
        code_input: code.toUpperCase(),
        order_total: orderTotalCents
      });

      if (error) {
        console.error('❌ Error validating discount code:', error);
        throw new Error('Failed to validate discount code');
      }

      const result = data?.[0] as DiscountValidation;
      console.log('✅ Discount validation result:', result);

      if (!result?.is_valid && result?.error_message) {
        throw new Error(result.error_message);
      }

      return {
        ...result,
        discount_amount: result.discount_amount / 100 // Convert back from cents
      };
    },
    onError: (error) => {
      toast({
        title: 'Invalid Discount Code',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useDiscountCodes = () => {
  return useQuery({
    queryKey: ['discount-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DiscountCode[];
    }
  });
};
