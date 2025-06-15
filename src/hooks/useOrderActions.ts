
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useOrderActions = () => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const setActionLoading = (orderId: string, action: string, isLoading: boolean) => {
    setLoading(prev => ({
      ...prev,
      [`${orderId}-${action}`]: isLoading
    }));
  };

  const isActionLoading = (orderId: string, action: string) => {
    return loading[`${orderId}-${action}`] || false;
  };

  const refreshPaymentStatus = async (orderId: string) => {
    setActionLoading(orderId, 'refresh', true);
    try {
      const { data, error } = await supabase.functions.invoke('refresh-payment-status', {
        body: { orderId }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: data?.message || 'Payment status refreshed',
      });

      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh payment status',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setActionLoading(orderId, 'refresh', false);
    }
  };

  const createProforma = async (orderData: any) => {
    setActionLoading(orderData.id, 'proforma', true);
    try {
      const { data, error } = await supabase.functions.invoke('smartbill-create-proforma', {
        body: { orderData }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Proforma created successfully',
      });

      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create proforma',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setActionLoading(orderData.id, 'proforma', false);
    }
  };

  const convertToInvoice = async (orderId: string) => {
    setActionLoading(orderId, 'invoice', true);
    try {
      const { data, error } = await supabase.functions.invoke('convert-to-invoice', {
        body: { orderId }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Successfully converted to invoice',
      });

      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to convert to invoice',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setActionLoading(orderId, 'invoice', false);
    }
  };

  const bulkRefreshStatus = async (orderIds: string[]) => {
    setActionLoading('bulk', 'refresh', true);
    try {
      const { data, error } = await supabase.functions.invoke('bulk-refresh-payment-status', {
        body: { orderIds }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `${data?.changedCount || 0} orders updated`,
      });

      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh payment statuses',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setActionLoading('bulk', 'refresh', false);
    }
  };

  return {
    refreshPaymentStatus,
    createProforma,
    convertToInvoice,
    bulkRefreshStatus,
    isActionLoading,
    loading
  };
};
