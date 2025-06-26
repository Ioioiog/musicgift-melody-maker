import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Enhanced SMTP client with proper SSL/TLS handling
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
        this.conn = await Deno.connectTls({
          hostname: this.hostname,
          port: this.port,
        });
      } else {
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
    const ehloResponse = await this.sendCommand(`EHLO ${this.hostname}`);
    if (!ehloResponse.includes('250')) {
      throw new Error(`EHLO failed: ${ehloResponse}`);
    }

    if (this.useSTARTTLS && !this.useTLS) {
      await this.startTLS();
      await this.sendCommand(`EHLO ${this.hostname}`);
    }

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
async function sendEmailWithFallback(from: string, to: string[], subject: string, body: string, password: string): Promise<string> {
  const configurations = [
    { port: 465, useTLS: true, useSTARTTLS: false, description: 'Implicit SSL (465)' },
    { port: 587, useTLS: false, useSTARTTLS: true, description: 'STARTTLS (587)' },
    { port: 25, useTLS: false, useSTARTTLS: false, description: 'Plain (25)' }
  ];

  let lastError: Error | null = null;

  for (const config of configurations) {
    try {
      console.log(`Trying ${config.description}...`);
      
      const smtpClient = new EnhancedSMTPClient(
        'mail.musicgift.ro',
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { giftCardId } = await req.json()

    // Get gift card details
    const { data: giftCard, error: giftError } = await supabaseClient
      .from('gift_cards')
      .select('*')
      .eq('id', giftCardId)
      .single()

    if (giftError || !giftCard) {
      throw new Error('Gift card not found')
    }

    // FIXED: Check for both 'paid' and 'completed' payment status since SmartBill sync uses 'paid'
    if (giftCard.status !== 'active' || (giftCard.payment_status !== 'completed' && giftCard.payment_status !== 'paid')) {
      console.error('Gift card is not ready for delivery:', {
        id: giftCard.id,
        code: giftCard.code,
        status: giftCard.status,
        payment_status: giftCard.payment_status
      });
      throw new Error(`Gift card is not ready for delivery. Status: ${giftCard.status}, Payment: ${giftCard.payment_status}`);
    }

    // CRITICAL: Validate gift card code is not temporary
    if (!giftCard.code || giftCard.code.startsWith('TEMP-')) {
      console.error('Gift card has invalid/temporary code:', giftCard.code);
      throw new Error('Gift card has invalid or temporary code');
    }

    console.log('Gift card validation passed, proceeding with email delivery:', {
      id: giftCard.id,
      code: giftCard.code,
      recipient: giftCard.recipient_email
    });

    // Get SMTP password from environment
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');
    if (!smtpPassword) {
      throw new Error('SMTP password not configured');
    }

    // Create redemption URL
    const redemptionUrl = `${Deno.env.get('SITE_URL')}/gift?gift=${giftCard.code}`
    const giftAmount = giftCard.gift_amount

    // Prepare email content with consistent styling
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Musical Gift Awaits!</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .gift-card { background: white; border: 2px dashed #667eea; padding: 20px; margin: 20px 0; text-align: center; border-radius: 10px; }
            .code { font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px; margin: 10px 0; }
            .amount { font-size: 28px; font-weight: bold; color: #764ba2; }
            .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎵 Your Musical Gift Has Arrived! 🎵</h1>
              <p>Someone special has sent you a personalized song</p>
            </div>
            
            <div class="content">
              <h2>Hello ${giftCard.recipient_name}!</h2>
              
              <p><strong>${giftCard.sender_name}</strong> has sent you a special musical gift!</p>
              
              ${giftCard.message_text ? `
                <div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; font-style: italic;">
                  "${giftCard.message_text}"
                </div>
              ` : ''}
              
              <div class="gift-card">
                <h3>🎁 Gift Card Details</h3>
                <div class="amount">${giftAmount} ${giftCard.currency}</div>
                <div class="code">${giftCard.code}</div>
                <p>Use this code to create your personalized song</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${redemptionUrl}" class="btn">Redeem Your Gift Card</a>
              </div>
              
              <h3>How it works:</h3>
              <ol>
                <li>Click the "Redeem Your Gift Card" button above</li>
                <li>Enter your gift card code: <strong>${giftCard.code}</strong></li>
                <li>Choose your preferred music package</li>
                <li>Share your story and preferences</li>
                <li>Receive your personalized song within a few days</li>
              </ol>
              
              <p><strong>Your gift card expires on:</strong> ${new Date(giftCard.expires_at || '').toLocaleDateString()}</p>
            </div>
            
            <div class="footer">
              <p>This gift card was purchased through MusicGift</p>
              <p>If you have any questions, please contact our support team</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email via cPanel SMTP
    const result = await sendEmailWithFallback(
      'info@musicgift.ro',
      [giftCard.recipient_email],
      `🎵 Musical Gift from ${giftCard.sender_name} - ${giftAmount} ${giftCard.currency}`,
      emailHtml,
      smtpPassword
    );

    console.log(`Gift card email sent successfully to ${giftCard.recipient_email}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Gift card email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Gift card email error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
