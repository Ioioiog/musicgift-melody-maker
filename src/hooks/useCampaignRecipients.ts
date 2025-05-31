
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CampaignRecipientActivity {
  id: string;
  campaign_id: string;
  email: string;
  action_type: 'delivered' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed' | 'complained';
  action_timestamp: string;
  ip_address?: string;
  user_agent?: string;
  link_url?: string;
  bounce_reason?: string;
  created_at: string;
  updated_at: string;
}

export const useCampaignRecipientActivity = (campaignId?: string) => {
  return useQuery({
    queryKey: ['campaign-recipient-activity', campaignId],
    queryFn: async () => {
      if (!campaignId) return [];
      
      const { data, error } = await supabase
        .from('campaign_recipient_activity')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('action_timestamp', { ascending: false });

      if (error) throw error;
      return data as CampaignRecipientActivity[];
    },
    enabled: !!campaignId,
  });
};

export const useSyncCampaignRecipients = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, actionType }: { campaignId: string; actionType?: string }) => {
      const { data, error } = await supabase.functions.invoke('brevo-campaign-recipients', {
        body: { campaignId, actionType }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-recipient-activity'] });
      toast({
        title: "Recipient data synced",
        description: "Campaign recipient activity has been updated from Brevo.",
      });
    },
    onError: (error: any) => {
      console.error('Recipient sync error:', error);
      toast({
        title: "Recipient sync failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });
};
