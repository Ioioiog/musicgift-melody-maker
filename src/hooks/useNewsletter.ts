
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribed_at: string;
  is_active: boolean;
  source: string;
  brevo_contact_id?: string;
  created_at: string;
  updated_at: string;
  last_brevo_sync?: string;
  sync_status?: string;
  brevo_updated_at?: string;
  brevo_list_ids?: any;
}

export const useNewsletterSubscribe = () => {
  return useMutation({
    mutationFn: async ({ email, name }: { email: string; name?: string }) => {
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: { email, name }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
    },
    onError: (error: any) => {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });
};

export const useNewsletterSubscribers = () => {
  return useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as NewsletterSubscriber[];
    },
  });
};

export const useUnsubscribe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, token }: { id: string; token: string }) => {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('unsubscribe_token', token)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
      toast({
        title: "Successfully unsubscribed",
        description: "You have been removed from our newsletter.",
      });
    },
    onError: () => {
      toast({
        title: "Unsubscribe failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSubscriber = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
      toast({
        title: "Subscriber deleted",
        description: "Subscriber has been permanently removed.",
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
