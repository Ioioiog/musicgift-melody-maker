
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

// Enhanced SMTP client with proper SSL/TLS handling (same as contact email function)
class EnhancedSMTPClient {
  private conn: Deno.TcpConn | Deno.TlsConn | null = null;
  private hostname: string;
  private port: number;
  private username: string;
  private password: string;
  private useTLS: boolean;
  private useSTARTTLS: boolean;

  constructor(hostname: string, port: number, username: string, password: string, useTLS: boolean = false, useSTARTTLS: boolean = false) {
    this.hostname = hostname;
    this.port = port;
    this.username = username;
    this.password = password;
    this.useTLS = useTLS;
    this.useSTARTTLS = useSTARTTLS;
  }

  async connect(): Promise<void> {
    console.log(`Attempting connection to ${this.hostname}:${this.port} (TLS: ${this.useTLS}, STARTTLS: ${this.useSTARTTLS})`);
    
    try {
      if (this.useTLS) {
        // Implicit TLS/SSL (port 465)
        this.conn = await Deno.connectTls({
          hostname: this.hostname,
          port: this.port,
        });
      } else {
        // Plain connection first (for STARTTLS or non-secure)
        this.conn = await Deno.connect({
          hostname: this.hostname,
          port: this.port,
        });
      }
      
      const welcome = await this.readResponse();
      console.log('Server welcome:', welcome);
      
      if (!welcome.startsWith('220')) {
        throw new Error(`Unexpected welcome response: ${welcome}`);
      }
    } catch (error) {
      console.error(`Connection failed: ${error.message}`);
      throw error;
    }
  }

  async sendCommand(command: string): Promise<string> {
    if (!this.conn) throw new Error('Not connected');
    
    console.log(`Sending command: ${command.startsWith('AUTH') ? 'AUTH [hidden]' : command}`);
    const encoder = new TextEncoder();
    await this.conn.write(encoder.encode(command + '\r\n'));
    const response = await this.readResponse();
    console.log(`Server response: ${response}`);
    return response;
  }

  async readResponse(): Promise<string> {
    if (!this.conn) throw new Error('Not connected');
    
    const buffer = new Uint8Array(2048);
    const n = await this.conn.read(buffer);
    const decoder = new TextDecoder();
    const response = decoder.decode(buffer.subarray(0, n || 0));
    return response.trim();
  }

  async authenticate(): Promise<void> {
    // Send EHLO first
    const ehloResponse = await this.sendCommand(`EHLO ${this.hostname}`);
    if (!ehloResponse.includes('250')) {
      throw new Error(`EHLO failed: ${ehloResponse}`);
    }

    // Handle STARTTLS if needed
    if (this.useSTARTTLS && !this.useTLS) {
      await this.startTLS();
      // Send EHLO again after STARTTLS
      await this.sendCommand(`EHLO ${this.hostname}`);
    }

    // Try AUTH LOGIN first
    try {
      await this.authLogin();
    } catch (error) {
      console.log('AUTH LOGIN failed, trying AUTH PLAIN');
      await this.authPlain();
    }
  }

  async startTLS(): Promise<void> {
    const response = await this.sendCommand('STARTTLS');
    if (!response.startsWith('220')) {
      throw new Error(`STARTTLS failed: ${response}`);
    }

    // Upgrade connection to TLS
    if (this.conn instanceof Deno.TcpConn) {
      this.conn = await Deno.startTls(this.conn, { hostname: this.hostname });
    }
  }

  async authLogin(): Promise<void> {
    const response = await this.sendCommand('AUTH LOGIN');
    if (!response.startsWith('334')) {
      throw new Error(`AUTH LOGIN not supported: ${response}`);
    }

    const usernameB64 = btoa(this.username);
    const usernameResponse = await this.sendCommand(usernameB64);
    if (!usernameResponse.startsWith('334')) {
      throw new Error(`Username rejected: ${usernameResponse}`);
    }

    const passwordB64 = btoa(this.password);
    const passwordResponse = await this.sendCommand(passwordB64);
    if (!passwordResponse.startsWith('235')) {
      throw new Error(`Authentication failed: ${passwordResponse}`);
    }
  }

  async authPlain(): Promise<void> {
    const authString = `\0${this.username}\0${this.password}`;
    const authB64 = btoa(authString);
    const response = await this.sendCommand(`AUTH PLAIN ${authB64}`);
    if (!response.startsWith('235')) {
      throw new Error(`AUTH PLAIN failed: ${response}`);
    }
  }

  async sendEmail(from: string, to: string[], subject: string, body: string): Promise<void> {
    const mailFromResponse = await this.sendCommand(`MAIL FROM:<${from}>`);
    if (!mailFromResponse.startsWith('250')) {
      throw new Error(`MAIL FROM failed: ${mailFromResponse}`);
    }
    
    for (const recipient of to) {
      const rcptResponse = await this.sendCommand(`RCPT TO:<${recipient}>`);
      if (!rcptResponse.startsWith('250')) {
        throw new Error(`RCPT TO failed for ${recipient}: ${rcptResponse}`);
      }
    }
    
    const dataResponse = await this.sendCommand('DATA');
    if (!dataResponse.startsWith('354')) {
      throw new Error(`DATA command failed: ${dataResponse}`);
    }
    
    const emailContent = [
      `From: ${from}`,
      `To: ${to.join(', ')}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      body,
      '.'
    ].join('\r\n');
    
    const sendResponse = await this.sendCommand(emailContent);
    if (!sendResponse.startsWith('250')) {
      throw new Error(`Email sending failed: ${sendResponse}`);
    }
  }

  async quit(): Promise<void> {
    if (this.conn) {
      try {
        await this.sendCommand('QUIT');
      } catch (error) {
        console.log('QUIT command failed, but connection will be closed anyway');
      }
      this.conn.close();
      this.conn = null;
    }
  }
}

// Function to try multiple SMTP configurations
async function sendEmailWithFallback(hostname: string, from: string, to: string[], subject: string, body: string, password: string): Promise<string> {
  const configurations = [
    // Try implicit SSL first (port 465)
    { port: 465, useTLS: true, useSTARTTLS: false, description: 'Implicit SSL (465)' },
    // Try STARTTLS (port 587)
    { port: 587, useTLS: false, useSTARTTLS: true, description: 'STARTTLS (587)' },
    // Try plain connection as last resort (port 25)
    { port: 25, useTLS: false, useSTARTTLS: false, description: 'Plain (25)' }
  ];

  let lastError: Error | null = null;

  for (const config of configurations) {
    try {
      console.log(`Trying ${config.description}...`);
      
      const smtpClient = new EnhancedSMTPClient(
        hostname,
        config.port,
        from,
        password,
        config.useTLS,
        config.useSTARTTLS
      );

      await smtpClient.connect();
      await smtpClient.authenticate();
      await smtpClient.sendEmail(from, to, subject, body);
      await smtpClient.quit();

      console.log(`Email sent successfully using ${config.description}`);
      return `Email sent successfully using ${config.description}`;
      
    } catch (error) {
      console.error(`${config.description} failed:`, error.message);
      lastError = error;
      continue;
    }
  }

  throw lastError || new Error('All SMTP configurations failed');
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
    console.log(`SMTP Server: ${account.smtp_server}`);
    console.log(`To: ${to.join(', ')}`);
    console.log(`Subject: ${subject}`);

    // Try to send email with fallback configurations
    const result = await sendEmailWithFallback(
      account.smtp_server,
      account.email_address,
      [...to, ...cc, ...bcc],
      subject,
      bodyHtml || bodyPlain || '',
      smtpPassword
    );

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
      sentEmail,
      method: result
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
