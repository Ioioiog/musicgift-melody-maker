
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FetchEmailsRequest {
  accountId: string;
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

    const { accountId, forceRefresh = false }: FetchEmailsRequest = await req.json();

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
        .order('received_date', { ascending: false })
        .limit(10);

      if (!cacheError && cachedEmails && cachedEmails.length > 0) {
        // Check if cache is recent (less than 5 minutes old)
        const lastSync = account.last_sync_at ? new Date(account.last_sync_at) : new Date(0);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        if (lastSync > fiveMinutesAgo) {
          console.log('Returning cached emails for account:', accountId);
          return new Response(JSON.stringify({ 
            success: true, 
            emails: cachedEmails,
            fromCache: true 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }

    console.log('Fetching fresh emails from IMAP for account:', accountId);

    // Simulate IMAP connection and email fetching
    // In a real implementation, you would use an IMAP library like node-imap
    // For now, we'll create mock data to demonstrate the structure
    const mockEmails = [
      {
        message_id: `msg_${Date.now()}_1@musicgift.ro`,
        sender_email: 'test@example.com',
        sender_name: 'Test Sender',
        subject: 'Test Email 1',
        body_preview: 'This is a preview of the first test email...',
        full_body: 'This is the full content of the first test email. It contains more detailed information.',
        received_date: new Date().toISOString(),
        has_attachments: false,
        raw_headers: {
          'message-id': `msg_${Date.now()}_1@musicgift.ro`,
          'from': 'test@example.com',
          'to': account.email_address
        }
      },
      {
        message_id: `msg_${Date.now()}_2@musicgift.ro`,
        sender_email: 'support@musicgift.ro',
        sender_name: 'Music Gift Support',
        subject: 'Welcome to Music Gift',
        body_preview: 'Welcome to our platform! Here are some getting started tips...',
        full_body: 'Welcome to our platform! We are excited to have you on board. Here are some tips to get you started with creating amazing musical gifts.',
        received_date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        has_attachments: true,
        raw_headers: {
          'message-id': `msg_${Date.now()}_2@musicgift.ro`,
          'from': 'support@musicgift.ro',
          'to': account.email_address
        }
      }
    ];

    // Insert/update emails in the database
    const emailsToInsert = mockEmails.map(email => ({
      ...email,
      account_id: accountId,
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
      .order('received_date', { ascending: false })
      .limit(10);

    if (fetchError) {
      throw new Error(`Error fetching updated emails: ${fetchError.message}`);
    }

    console.log('Successfully fetched and cached emails for account:', accountId);

    return new Response(JSON.stringify({ 
      success: true, 
      emails: updatedEmails || [],
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

serve(handler);
