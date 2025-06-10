
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AutoGenerationRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger_type: 'order_completed' | 'first_order' | 'order_amount';
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount: number;
  maximum_discount_amount?: number;
  validity_days: number;
  code_prefix: string;
  limit_per_customer?: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface CreateAutoRuleData {
  name: string;
  enabled: boolean;
  triggerType: 'order_completed' | 'first_order' | 'order_amount';
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  validityDays: number;
  codePrefix: string;
  limitPerCustomer?: number;
}

export const useAutoGenerationRules = () => {
  return useQuery({
    queryKey: ['auto-generation-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discount_auto_rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AutoGenerationRule[];
    }
  });
};

export const useCreateAutoRule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateAutoRuleData) => {
      const { data: result, error } = await supabase
        .from('discount_auto_rules')
        .insert({
          name: data.name,
          enabled: data.enabled,
          trigger_type: data.triggerType,
          discount_type: data.discountType,
          discount_value: data.discountType === 'percentage' ? data.discountValue : Math.round(data.discountValue * 100),
          minimum_order_amount: data.minimumOrderAmount ? Math.round(data.minimumOrderAmount * 100) : 0,
          maximum_discount_amount: data.maximumDiscountAmount ? Math.round(data.maximumDiscountAmount * 100) : undefined,
          validity_days: data.validityDays,
          code_prefix: data.codePrefix.toUpperCase(),
          limit_per_customer: data.limitPerCustomer,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-generation-rules'] });
      toast({
        title: 'Success',
        description: 'Auto-generation rule created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create auto-generation rule',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateAutoRule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateAutoRuleData> }) => {
      const updateData: any = {};
      
      if (data.name) updateData.name = data.name;
      if (data.enabled !== undefined) updateData.enabled = data.enabled;
      if (data.triggerType) updateData.trigger_type = data.triggerType;
      if (data.discountType) updateData.discount_type = data.discountType;
      if (data.discountValue !== undefined) {
        updateData.discount_value = data.discountType === 'percentage' 
          ? data.discountValue 
          : Math.round(data.discountValue * 100);
      }
      if (data.minimumOrderAmount !== undefined) {
        updateData.minimum_order_amount = Math.round(data.minimumOrderAmount * 100);
      }
      if (data.maximumDiscountAmount !== undefined) {
        updateData.maximum_discount_amount = Math.round(data.maximumDiscountAmount * 100);
      }
      if (data.validityDays) updateData.validity_days = data.validityDays;
      if (data.codePrefix) updateData.code_prefix = data.codePrefix.toUpperCase();
      if (data.limitPerCustomer !== undefined) updateData.limit_per_customer = data.limitPerCustomer;

      const { data: result, error } = await supabase
        .from('discount_auto_rules')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-generation-rules'] });
      toast({
        title: 'Success',
        description: 'Auto-generation rule updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update auto-generation rule',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteAutoRule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('discount_auto_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-generation-rules'] });
      toast({
        title: 'Success',
        description: 'Auto-generation rule deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete auto-generation rule',
        variant: 'destructive',
      });
    },
  });
};

export const useToggleAutoRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { data: result, error } = await supabase
        .from('discount_auto_rules')
        .update({ enabled })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-generation-rules'] });
    },
  });
};
