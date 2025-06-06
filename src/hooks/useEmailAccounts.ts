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
  available_folders: string[];
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
  folder: string;
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

export const EMAIL_FOLDERS = [
  { id: 'INBOX', name: 'Inbox', icon: '📥' },
  { id: 'Sent', name: 'Sent', icon: '📤' },
  { id: 'Drafts', name: 'Drafts', icon: '📝' },
  { id: 'Trash', name: 'Trash', icon: '🗑️' }
];

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

export const useEmailMessages = (accountId: string | null, folder: string = 'INBOX') => {
  return useQuery({
    queryKey: ['email-messages', accountId, folder],
    queryFn: async () => {
      if (!accountId) return [];
      
      const { data, error } = await supabase
        .from('email_messages')
        .select(`
          *,
          email_attachments (*)
        `)
        .eq('account_id', accountId)
        .eq('folder', folder)
        .order('received_date', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as EmailMessage[];
    },
    enabled: !!accountId
  });
};

export const useEmailFolderCounts = (accountId: string | null) => {
  return useQuery({
    queryKey: ['email-folder-counts', accountId],
    queryFn: async () => {
      if (!accountId) return {};
      
      const folderCounts: Record<string, { total: number; unread: number }> = {};
      
      for (const folder of EMAIL_FOLDERS) {
        const { count: totalCount } = await supabase
          .from('email_messages')
          .select('*', { count: 'exact', head: true })
          .eq('account_id', accountId)
          .eq('folder', folder.id);
          
        const { count: unreadCount } = await supabase
          .from('email_messages')
          .select('*', { count: 'exact', head: true })
          .eq('account_id', accountId)
          .eq('folder', folder.id)
          .eq('is_read', false);
          
        folderCounts[folder.id] = {
          total: totalCount || 0,
          unread: unreadCount || 0
        };
      }
      
      return folderCounts;
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
          available_folders: ['INBOX', 'Sent', 'Drafts', 'Trash'],
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
      queryClient.invalidateQueries({ queryKey: ['email-folder-counts'] });
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
    mutationFn: async ({ 
      accountId, 
      folder = 'INBOX', 
      forceRefresh = false 
    }: { 
      accountId: string; 
      folder?: string;
      forceRefresh?: boolean; 
    }) => {
      const { data, error } = await supabase.functions.invoke('imap-fetch-emails', {
        body: { accountId, folder, forceRefresh }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['email-messages', variables.accountId, variables.folder] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['email-folder-counts', variables.accountId] 
      });
      if (!data.fromCache) {
        toast.success(`${variables.folder} emails refreshed successfully`);
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
      queryClient.invalidateQueries({ queryKey: ['email-folder-counts'] });
    },
    onError: (error: any) => {
      toast.error(`Error updating email: ${error.message}`);
    }
  });
};

export const useMoveEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      messageId, 
      targetFolder 
    }: { 
      messageId: string; 
      targetFolder: string; 
    }) => {
      const { error } = await supabase
        .from('email_messages')
        .update({ folder: targetFolder })
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-messages'] });
      queryClient.invalidateQueries({ queryKey: ['email-folder-counts'] });
      toast.success('Email moved successfully');
    },
    onError: (error: any) => {
      toast.error(`Error moving email: ${error.message}`);
    }
  });
};

// NEW HOOKS FOR EMAIL SENDING

export const useSendEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emailData: {
      accountId: string;
      to: string[];
      cc?: string[];
      bcc?: string[];
      subject: string;
      bodyHtml?: string;
      bodyPlain?: string;
      draftId?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('smtp-send-email', {
        body: emailData
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-messages'] });
      queryClient.invalidateQueries({ queryKey: ['email-folder-counts'] });
      queryClient.invalidateQueries({ queryKey: ['email-drafts'] });
      toast.success('Email sent successfully');
    },
    onError: (error: any) => {
      toast.error(`Error sending email: ${error.message}`);
    }
  });
};

export const useEmailDrafts = (accountId: string | null) => {
  return useQuery({
    queryKey: ['email-drafts', accountId],
    queryFn: async () => {
      if (!accountId) return [];
      
      const { data, error } = await supabase
        .from('email_drafts')
        .select('*')
        .eq('account_id', accountId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!accountId
  });
};

export const useSaveEmailDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (draftData: {
      accountId: string;
      to: string[];
      cc?: string[];
      bcc?: string[];
      subject: string;
      bodyHtml?: string;
      bodyPlain?: string;
      id?: string;
    }) => {
      const { id, ...data } = draftData;
      
      if (id) {
        // Update existing draft
        const { data: updatedDraft, error } = await supabase
          .from('email_drafts')
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return updatedDraft;
      } else {
        // Create new draft
        const { data: newDraft, error } = await supabase
          .from('email_drafts')
          .insert({
            account_id: draftData.accountId,
            to_emails: draftData.to,
            cc_emails: draftData.cc || [],
            bcc_emails: draftData.bcc || [],
            subject: draftData.subject,
            body_html: draftData.bodyHtml,
            body_plain: draftData.bodyPlain
          })
          .select()
          .single();

        if (error) throw error;
        return newDraft;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-drafts'] });
    },
    onError: (error: any) => {
      toast.error(`Error saving draft: ${error.message}`);
    }
  });
};

export const useDeleteEmailDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (draftId: string) => {
      const { error } = await supabase
        .from('email_drafts')
        .delete()
        .eq('id', draftId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-drafts'] });
      toast.success('Draft deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Error deleting draft: ${error.message}`);
    }
  });
};
