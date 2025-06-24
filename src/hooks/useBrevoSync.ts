
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SyncLog {
  id: string;
  operation_type: string;
  direction: string;
  status: string;
  records_processed: number;
  records_succeeded: number;
  records_failed: number;
  error_details?: any;
  started_at: string;
  completed_at?: string;
  created_at: string;
}

export interface SyncConflict {
  id: string;
  email: string;
  conflict_type: string;
  local_data: any;
  brevo_data: any;
  resolution_strategy?: string;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  created_at: string;
}

export const useBrevoSync = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ direction = 'bidirectional', operationType = 'manual_sync', forceUpdate = false }: {
      direction?: 'brevo_to_local' | 'local_to_brevo' | 'bidirectional';
      operationType?: 'full_sync' | 'incremental_sync' | 'manual_sync';
      forceUpdate?: boolean;
    }) => {
      const { data, error } = await supabase.functions.invoke('brevo-sync-contacts', {
        body: { direction, operationType, forceUpdate }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['sync-logs'] });
      
      toast({
        title: "Sync completed",
        description: `${data.recordsSucceeded}/${data.recordsProcessed} contacts synced successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Brevo sync error:', error);
      toast({
        title: "Sync failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });
};

export const useSyncLogs = () => {
  return useQuery({
    queryKey: ['sync-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_sync_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as SyncLog[];
    },
  });
};

export const useSyncConflicts = () => {
  return useQuery({
    queryKey: ['sync-conflicts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_sync_conflicts')
        .select('*')
        .eq('resolved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SyncConflict[];
    },
  });
};

export const useResolveConflict = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ conflictId, resolutionStrategy }: { conflictId: string; resolutionStrategy: string }) => {
      const { data, error } = await supabase
        .from('newsletter_sync_conflicts')
        .update({
          resolution_strategy: resolutionStrategy,
          resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('id', conflictId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sync-conflicts'] });
      toast({
        title: "Conflict resolved",
        description: "The sync conflict has been resolved.",
      });
    },
    onError: () => {
      toast({
        title: "Resolution failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });
};
