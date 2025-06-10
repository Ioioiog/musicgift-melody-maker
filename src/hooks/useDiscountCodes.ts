
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

export interface CreateDiscountCodeData {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  expiresAt?: string;
  isActive: boolean;
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DiscountCode[];
    }
  });
};

export const useCreateDiscountCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDiscountCodeData) => {
      const { data: result, error } = await supabase
        .from('discount_codes')
        .insert({
          code: data.code.toUpperCase(),
          discount_type: data.discountType,
          discount_value: data.discountValue,
          minimum_order_amount: data.minimumOrderAmount || 0,
          maximum_discount_amount: data.maximumDiscountAmount,
          usage_limit: data.usageLimit,
          expires_at: data.expiresAt,
          is_active: data.isActive,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discount-codes'] });
    },
  });
};

export const useUpdateDiscountCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateDiscountCodeData> }) => {
      const updateData: any = {};
      
      if (data.code) updateData.code = data.code.toUpperCase();
      if (data.discountType) updateData.discount_type = data.discountType;
      if (data.discountValue !== undefined) updateData.discount_value = data.discountValue;
      if (data.minimumOrderAmount !== undefined) updateData.minimum_order_amount = data.minimumOrderAmount;
      if (data.maximumDiscountAmount !== undefined) updateData.maximum_discount_amount = data.maximumDiscountAmount;
      if (data.usageLimit !== undefined) updateData.usage_limit = data.usageLimit;
      if (data.expiresAt !== undefined) updateData.expires_at = data.expiresAt;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;

      const { data: result, error } = await supabase
        .from('discount_codes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discount-codes'] });
    },
  });
};

export const useDeleteDiscountCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discount-codes'] });
    },
  });
};

export const useToggleDiscountCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data: result, error } = await supabase
        .from('discount_codes')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discount-codes'] });
    },
  });
};
