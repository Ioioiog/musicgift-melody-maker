
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendEmailRequest {
  accountId: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  bodyHtml?: string;
  bodyPlain?: string;
  draftId?: string;
}

// Simple SMTP client implementation
class SMTPClient {
  private conn: Deno.TcpConn | null = null;
  private hostname: string;
  private port: number;
  private username: string;
  private password: string;

  constructor(hostname: string, port: number, username: string, password: string) {
    this.hostname = hostname;
    this.port = port;
    this.username = username;
    this.password = password;
  }

  async connect(): Promise<void> {
    this.conn = await Deno.connectTls({
      hostname: this.hostname,
      port: this.port,
    });
    await this.readResponse(); // Read welcome message
  }

  async sendCommand(command: string): Promise<string> {
    if (!this.conn) throw new Error('Not connected');
    
    const encoder = new TextEncoder();
    await this.conn.write(encoder.encode(command + '\r\n'));
    return await this.readResponse();
  }

  async readResponse(): Promise<string> {
    if (!this.conn) throw new Error('Not connected');
    
    const buffer = new Uint8Array(1024);
    const n = await this.conn.read(buffer);
    const decoder = new TextDecoder();
    return decoder.decode(buffer.subarray(0, n || 0));
  }

  async authenticate(): Promise<void> {
    await this.sendCommand('EHLO ' + this.hostname);
    await this.sendCommand('AUTH LOGIN');
    
    // Send base64 encoded username and password
    const encoder = new TextEncoder();
    const usernameB64 = btoa(this.username);
    const passwordB64 = btoa(this.password);
    
    await this.sendCommand(usernameB64);
    await this.sendCommand(passwordB64);
  }

  async sendEmail(from: string, to: string[], subject: string, body: string): Promise<void> {
    await this.sendCommand(`MAIL FROM:<${from}>`);
    
    for (const recipient of to) {
      await this.sendCommand(`RCPT TO:<${recipient}>`);
    }
    
    await this.sendCommand('DATA');
    
    const emailContent = [
      `From: ${from}`,
      `To: ${to.join(', ')}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      body,
      '.'
    ].join('\r\n');
    
    await this.sendCommand(emailContent);
  }

  async quit(): Promise<void> {
    if (this.conn) {
      await this.sendCommand('QUIT');
      this.conn.close();
      this.conn = null;
    }
  }
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

    const {
      accountId,
      to,
      cc = [],
      bcc = [],
      subject,
      bodyHtml,
      bodyPlain,
      draftId
    }: SendEmailRequest = await req.json();

    // Get the email account with SMTP configuration
    const { data: account, error: accountError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('id', accountId)
      .eq('user_id', user.id)
      .single();

    if (accountError || !account) {
      throw new Error('Email account not found');
    }

    // Get SMTP password from environment
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');
    if (!smtpPassword) {
      throw new Error('SMTP password not configured');
    }

    console.log(`Sending email from: ${account.email_address}`);
    console.log(`SMTP Server: ${account.smtp_server}:${account.smtp_port} (${account.smtp_security})`);
    console.log(`To: ${to.join(', ')}`);
    console.log(`Subject: ${subject}`);

    // Create SMTP client and send email
    const smtpClient = new SMTPClient(
      account.smtp_server,
      account.smtp_port,
      account.email_address,
      smtpPassword
    );

    try {
      await smtpClient.connect();
      await smtpClient.authenticate();
      await smtpClient.sendEmail(
        account.email_address,
        [...to, ...cc, ...bcc],
        subject,
        bodyHtml || bodyPlain || ''
      );
      await smtpClient.quit();
    } catch (smtpError) {
      console.error('SMTP Error:', smtpError);
      throw new Error(`Failed to send email: ${smtpError.message}`);
    }

    // Generate a unique message ID
    const messageId = `${Date.now()}.${Math.random().toString(36).substr(2, 9)}@${account.smtp_server}`;

    // Store the sent email
    const { data: sentEmail, error: insertError } = await supabase
      .from('sent_emails')
      .insert({
        account_id: accountId,
        draft_id: draftId,
        to_emails: to,
        cc_emails: cc,
        bcc_emails: bcc,
        subject,
        body_html: bodyHtml,
        body_plain: bodyPlain,
        message_id: messageId,
        delivery_status: 'sent'
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to record sent email: ${insertError.message}`);
    }

    // If this was a draft, mark it as sent or delete it
    if (draftId) {
      await supabase
        .from('email_drafts')
        .delete()
        .eq('id', draftId);
    }

    // Also add to email_messages as a sent item
    await supabase
      .from('email_messages')
      .insert({
        account_id: accountId,
        message_id: messageId,
        sender_email: account.email_address,
        sender_name: account.email_address,
        subject,
        body_preview: bodyPlain ? bodyPlain.substring(0, 200) : bodyHtml?.substring(0, 200),
        full_body: bodyHtml || bodyPlain,
        received_date: new Date().toISOString(),
        is_read: true,
        has_attachments: false,
        folder: 'Sent',
        raw_headers: {
          'message-id': messageId,
          'from': account.email_address,
          'to': to.join(', ')
        }
      });

    console.log(`Email sent successfully with message ID: ${messageId}`);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId,
      sentEmail 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in smtp-send-email function:', error);
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
