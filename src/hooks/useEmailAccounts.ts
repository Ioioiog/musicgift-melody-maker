
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface EmailAccount {
  id: string;
  user_id: string;
  email_address: string;
  encrypted_password: string;
  imap_server: string;
  imap_port: number;
  is_active: boolean;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailMessage {
  id: string;
  account_id: string;
  message_id: string;
  sender_email: string;
  sender_name: string | null;
  subject: string;
  body_preview: string | null;
  full_body: string | null;
  received_date: string;
  is_read: boolean;
  has_attachments: boolean;
  raw_headers: any;
  created_at: string;
  email_attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  id: string;
  message_id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  attachment_data: string | null;
  created_at: string;
}

export const useEmailAccounts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['email-accounts', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('email_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EmailAccount[];
    },
    enabled: !!user?.id
  });
};

export const useEmailMessages = (accountId: string | null) => {
  return useQuery({
    queryKey: ['email-messages', accountId],
    queryFn: async () => {
      if (!accountId) return [];
      
      const { data, error } = await supabase
        .from('email_messages')
        .select(`
          *,
          email_attachments (*)
        `)
        .eq('account_id', accountId)
        .order('received_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as EmailMessage[];
    },
    enabled: !!accountId
  });
};

export const useAddEmailAccount = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (accountData: {
      email_address: string;
      password: string;
      imap_server?: string;
      imap_port?: number;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Simple encryption (in production, use proper encryption)
      const encrypted_password = btoa(accountData.password);

      const { data, error } = await supabase
        .from('email_accounts')
        .insert({
          user_id: user.id,
          email_address: accountData.email_address,
          encrypted_password,
          imap_server: accountData.imap_server || 'mail.musicgift.ro',
          imap_port: accountData.imap_port || 993,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-accounts'] });
      toast.success('Email account added successfully');
    },
    onError: (error: any) => {
      toast.error(`Error adding email account: ${error.message}`);
    }
  });
};

export const useDeleteEmailAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountId: string) => {
      const { error } = await supabase
        .from('email_accounts')
        .delete()
        .eq('id', accountId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['email-messages'] });
      toast.success('Email account deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting email account: ${error.message}`);
    }
  });
};

export const useFetchEmails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountId, forceRefresh = false }: { 
      accountId: string; 
      forceRefresh?: boolean; 
    }) => {
      const { data, error } = await supabase.functions.invoke('imap-fetch-emails', {
        body: { accountId, forceRefresh }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['email-messages', variables.accountId] });
      if (!data.fromCache) {
        toast.success('Emails refreshed successfully');
      }
    },
    onError: (error: any) => {
      toast.error(`Error fetching emails: ${error.message}`);
    }
  });
};

export const useMarkEmailAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, isRead }: { messageId: string; isRead: boolean }) => {
      const { error } = await supabase
        .from('email_messages')
        .update({ is_read: isRead })
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-messages'] });
    },
    onError: (error: any) => {
      toast.error(`Error updating email: ${error.message}`);
    }
  });
};
