
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string | null;
  html_content: string | null;
  brevo_campaign_id: string | null;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  scheduled_at: string | null;
  sent_at: string | null;
  target_list_ids: number[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignMetrics {
  id: string;
  campaign_id: string;
  opens: number;
  clicks: number;
  bounces: number;
  unsubscribes: number;
  delivered: number;
  soft_bounces: number;
  hard_bounces: number;
  spam_reports: number;
  last_updated: string;
  created_at: string;
}

export const useCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Campaign[];
    },
  });
};

export const useCampaignMetrics = (campaignId?: string) => {
  return useQuery({
    queryKey: ['campaign-metrics', campaignId],
    queryFn: async () => {
      if (!campaignId) return null;
      
      const { data, error } = await supabase
        .from('campaign_metrics')
        .select('*')
        .eq('campaign_id', campaignId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as CampaignMetrics | null;
    },
    enabled: !!campaignId,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignData: {
      name: string;
      subject: string;
      content?: string;
      html_content?: string;
      target_list_ids?: number[];
    }) => {
      const { data, error } = await supabase.functions.invoke('campaign-create', {
        body: campaignData
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Campaign created",
        description: "Your campaign has been created successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Campaign creation error:', error);
      toast({
        title: "Campaign creation failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });
};

export const useSendCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId }: { campaignId: string }) => {
      const { data, error } = await supabase.functions.invoke('campaign-send', {
        body: { campaignId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign-metrics'] });
      toast({
        title: "Campaign sent",
        description: "Your campaign has been sent successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Campaign send error:', error);
      toast({
        title: "Campaign send failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      campaignId, 
      updates 
    }: { 
      campaignId: string; 
      updates: Partial<Campaign> 
    }) => {
      const { data, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', campaignId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Campaign updated",
        description: "Your campaign has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Campaign update error:', error);
      toast({
        title: "Campaign update failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Campaign deleted",
        description: "Campaign has been permanently removed.",
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });
};
