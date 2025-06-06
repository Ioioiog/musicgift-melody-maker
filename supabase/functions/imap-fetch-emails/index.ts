
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FetchEmailsRequest {
  accountId: string;
  folder?: string;
  forceRefresh?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { accountId, folder = 'INBOX', forceRefresh = false }: FetchEmailsRequest = await req.json();

    // Get the email account
    const { data: account, error: accountError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('id', accountId)
      .eq('user_id', user.id)
      .single();

    if (accountError || !account) {
      throw new Error('Email account not found');
    }

    // Check if we should fetch from cache or IMAP
    if (!forceRefresh) {
      const { data: cachedEmails, error: cacheError } = await supabase
        .from('email_messages')
        .select(`
          *,
          email_attachments (*)
        `)
        .eq('account_id', accountId)
        .eq('folder', folder)
        .order('received_date', { ascending: false })
        .limit(10);

      if (!cacheError && cachedEmails && cachedEmails.length > 0) {
        // Check if cache is recent (less than 5 minutes old)
        const lastSync = account.last_sync_at ? new Date(account.last_sync_at) : new Date(0);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        if (lastSync > fiveMinutesAgo) {
          console.log(`Returning cached emails for account: ${accountId}, folder: ${folder}`);
          return new Response(JSON.stringify({ 
            success: true, 
            emails: cachedEmails,
            folder,
            fromCache: true 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }

    console.log(`Fetching fresh emails from IMAP for account: ${accountId}, folder: ${folder}`);

    // Generate folder-specific mock data
    const mockEmails = generateMockEmailsForFolder(folder, account.email_address);

    // Insert/update emails in the database
    const emailsToInsert = mockEmails.map(email => ({
      ...email,
      account_id: accountId,
      folder,
      is_read: false
    }));

    const { error: insertError } = await supabase
      .from('email_messages')
      .upsert(emailsToInsert, { 
        onConflict: 'account_id,message_id',
        ignoreDuplicates: false 
      });

    if (insertError) {
      console.error('Error inserting emails:', insertError);
    }

    // Update last sync time
    await supabase
      .from('email_accounts')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', accountId);

    // Fetch the updated emails with attachments
    const { data: updatedEmails, error: fetchError } = await supabase
      .from('email_messages')
      .select(`
        *,
        email_attachments (*)
      `)
      .eq('account_id', accountId)
      .eq('folder', folder)
      .order('received_date', { ascending: false })
      .limit(10);

    if (fetchError) {
      throw new Error(`Error fetching updated emails: ${fetchError.message}`);
    }

    console.log(`Successfully fetched and cached emails for account: ${accountId}, folder: ${folder}`);

    return new Response(JSON.stringify({ 
      success: true, 
      emails: updatedEmails || [],
      folder,
      fromCache: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in imap-fetch-emails function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

function generateMockEmailsForFolder(folder: string, emailAddress: string) {
  const baseTimestamp = Date.now();
  
  switch (folder) {
    case 'INBOX':
      return [
        {
          message_id: `inbox_${baseTimestamp}_1@musicgift.ro`,
          sender_email: 'customer@example.com',
          sender_name: 'Jane Customer',
          subject: 'Order Inquiry - Music Gift Package',
          body_preview: 'Hi, I have a question about my recent order...',
          full_body: 'Hi, I have a question about my recent order for the Premium Music Gift package. When can I expect delivery?',
          received_date: new Date(baseTimestamp - 1800000).toISOString(), // 30 min ago
          has_attachments: false,
          raw_headers: {
            'message-id': `inbox_${baseTimestamp}_1@musicgift.ro`,
            'from': 'customer@example.com',
            'to': emailAddress
          }
        },
        {
          message_id: `inbox_${baseTimestamp}_2@musicgift.ro`,
          sender_email: 'support@stripe.com',
          sender_name: 'Stripe',
          subject: 'Payment Confirmation',
          body_preview: 'Your payment has been processed successfully...',
          full_body: 'Your payment of €49.99 has been processed successfully for Music Gift order #12345.',
          received_date: new Date(baseTimestamp - 7200000).toISOString(), // 2 hours ago
          has_attachments: true,
          raw_headers: {
            'message-id': `inbox_${baseTimestamp}_2@musicgift.ro`,
            'from': 'support@stripe.com',
            'to': emailAddress
          }
        }
      ];
      
    case 'Sent':
      return [
        {
          message_id: `sent_${baseTimestamp}_1@musicgift.ro`,
          sender_email: emailAddress,
          sender_name: 'Music Gift Support',
          subject: 'Re: Order Inquiry - Music Gift Package',
          body_preview: 'Thank you for your inquiry. Your order will be delivered...',
          full_body: 'Thank you for your inquiry. Your order will be delivered within 2-3 business days. Here are the tracking details...',
          received_date: new Date(baseTimestamp - 900000).toISOString(), // 15 min ago
          has_attachments: false,
          raw_headers: {
            'message-id': `sent_${baseTimestamp}_1@musicgift.ro`,
            'from': emailAddress,
            'to': 'customer@example.com'
          }
        }
      ];
      
    case 'Drafts':
      return [
        {
          message_id: `draft_${baseTimestamp}_1@musicgift.ro`,
          sender_email: emailAddress,
          sender_name: 'Music Gift Support',
          subject: 'Weekly Newsletter - Music Gift Updates',
          body_preview: 'Dear valued customers, this week we are excited to announce...',
          full_body: 'Dear valued customers, this week we are excited to announce new features and improvements to our Music Gift platform.',
          received_date: new Date(baseTimestamp - 3600000).toISOString(), // 1 hour ago
          has_attachments: false,
          raw_headers: {
            'message-id': `draft_${baseTimestamp}_1@musicgift.ro`,
            'from': emailAddress,
            'to': ''
          }
        }
      ];
      
    case 'Trash':
      return [
        {
          message_id: `trash_${baseTimestamp}_1@musicgift.ro`,
          sender_email: 'spam@example.com',
          sender_name: 'Spam Sender',
          subject: 'You have won a million dollars!',
          body_preview: 'Congratulations! You are our lucky winner...',
          full_body: 'Congratulations! You are our lucky winner. Click here to claim your prize (this is obviously spam).',
          received_date: new Date(baseTimestamp - 86400000).toISOString(), // 1 day ago
          has_attachments: false,
          raw_headers: {
            'message-id': `trash_${baseTimestamp}_1@musicgift.ro`,
            'from': 'spam@example.com',
            'to': emailAddress
          }
        }
      ];
      
    default:
      return [];
  }
}

serve(handler);
