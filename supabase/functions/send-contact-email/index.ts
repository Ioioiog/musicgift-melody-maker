
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

// Simple SMTP client implementation (same as in smtp-send-email)
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
    const { firstName, lastName, email, subject, message }: ContactFormData = await req.json();

    console.log('Received contact form submission:', { firstName, lastName, email, subject });

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get SMTP password from environment
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');
    if (!smtpPassword) {
      console.error('SMTP_PASSWORD not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Prepare email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #f97316; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border-left: 4px solid #f97316; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Message</h3>
          <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; font-size: 12px; color: #666;">
            This email was sent from the MusicGift contact form. 
            Please reply directly to ${email} to respond to the customer.
          </p>
        </div>
      </div>
    `;

    // SMTP configuration
    const smtpConfig = {
      hostname: 'mail.musicgift.ro',
      port: 465,
      username: 'info@musicgift.ro',
      password: smtpPassword
    };

    console.log(`Sending contact email via SMTP: ${smtpConfig.hostname}:${smtpConfig.port}`);

    // Create SMTP client and send email
    const smtpClient = new SMTPClient(
      smtpConfig.hostname,
      smtpConfig.port,
      smtpConfig.username,
      smtpConfig.password
    );

    let messageId: string;

    try {
      await smtpClient.connect();
      await smtpClient.authenticate();
      await smtpClient.sendEmail(
        smtpConfig.username,
        [smtpConfig.username], // Send to info@musicgift.ro
        `Contact Form: ${subject}`,
        emailHtml
      );
      await smtpClient.quit();

      // Generate message ID for tracking
      messageId = `${Date.now()}.${Math.random().toString(36).substr(2, 9)}@${smtpConfig.hostname}`;
      
      console.log(`Contact email sent successfully with message ID: ${messageId}`);
    } catch (smtpError) {
      console.error('SMTP Error:', smtpError);
      throw new Error(`Failed to send email: ${smtpError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact form submitted successfully',
        messageId 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in send-contact-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
