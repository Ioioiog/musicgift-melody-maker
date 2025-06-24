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

    const { discountCodeId, customerEmail, customerName } = await req.json()

    // Get discount code details
    const { data: discountCode, error: discountError } = await supabaseClient
      .from('discount_codes')
      .select('*')
      .eq('id', discountCodeId)
      .single()

    if (discountError || !discountCode) {
      throw new Error('Discount code not found')
    }

    // Check if discount code is active
    if (!discountCode.is_active) {
      throw new Error('Discount code is not active')
    }

    // Get SMTP password from environment
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');
    if (!smtpPassword) {
      throw new Error('SMTP password not configured');
    }

    const discountAmount = discountCode.discount_type === 'percentage' 
      ? `${discountCode.discount_value}%` 
      : `${discountCode.discount_value / 100} RON`

    const expiryDate = discountCode.expires_at 
      ? new Date(discountCode.expires_at).toLocaleDateString() 
      : 'No expiry'

    const redemptionUrl = `${Deno.env.get('SITE_URL')}/order`

    // Prepare email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Exclusive Discount Code!</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .discount-card { background: white; border: 2px dashed #667eea; padding: 20px; margin: 20px 0; text-align: center; border-radius: 10px; }
            .code { font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px; margin: 10px 0; }
            .amount { font-size: 28px; font-weight: bold; color: #764ba2; }
            .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎵 Exclusive Discount Just for You! 🎵</h1>
              <p>Your special discount code is ready to use</p>
            </div>
            
            <div class="content">
              <h2>Hello ${customerName}!</h2>
              
              <p>We're excited to offer you an exclusive discount on your next personalized song!</p>
              
              <div class="discount-card">
                <h3>💳 Your Discount Code</h3>
                <div class="amount">${discountAmount} OFF</div>
                <div class="code">${discountCode.code}</div>
                <p>Use this code at checkout to save on your order</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${redemptionUrl}" class="btn">Create Your Song Now</a>
              </div>
              
              <h3>How to use your discount:</h3>
              <ol>
                <li>Click "Create Your Song Now" above or visit our order page</li>
                <li>Choose your preferred music package</li>
                <li>At checkout, enter your discount code: <strong>${discountCode.code}</strong></li>
                <li>Enjoy your savings and your personalized song!</li>
              </ol>
              
              <p><strong>Code expires:</strong> ${expiryDate}</p>
              ${discountCode.minimum_order_amount > 0 ? `<p><strong>Minimum order:</strong> ${discountCode.minimum_order_amount / 100} RON</p>` : ''}
              ${discountCode.usage_limit ? `<p><strong>Uses remaining:</strong> ${discountCode.usage_limit - discountCode.used_count}</p>` : ''}
            </div>
            
            <div class="footer">
              <p>This discount code was sent from MusicGift</p>
              <p>If you have any questions, please contact our support team</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email via cPanel SMTP
    const result = await sendEmailWithFallback(
      'info@musicgift.ro',
      [customerEmail],
      `🎵 ${discountAmount} OFF Your Next Song - Code: ${discountCode.code}`,
      emailHtml,
      smtpPassword
    );

    // Generate a unique message ID
    const messageId = `${Date.now()}.${Math.random().toString(36).substr(2, 9)}@mail.musicgift.ro`;

    // Log successful email delivery
    await supabaseClient
      .from('discount_email_deliveries')
      .insert({
        discount_code_id: discountCodeId,
        discount_code: discountCode.code,
        recipient_email: customerEmail,
        recipient_name: customerName,
        email_type: 'manual',
        delivery_status: 'sent',
        brevo_message_id: messageId // Using message_id field for SMTP tracking
      })

    console.log(`Discount code email sent successfully to ${customerEmail}`)

    return new Response(
      JSON.stringify({ success: true, message: 'Discount code email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Discount code email error:', error)
    
    // Log failed email delivery
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      )
      
      const { discountCodeId, discountCode, customerEmail, customerName } = await req.json()
      
      await supabaseClient
        .from('discount_email_deliveries')
        .insert({
          discount_code_id: discountCodeId,
          discount_code: discountCode?.code || 'unknown',
          recipient_email: customerEmail,
          recipient_name: customerName,
          email_type: 'manual',
          delivery_status: 'failed',
          error_message: error.message || 'SMTP delivery failed'
        })
    } catch (logError) {
      console.error('Failed to log email delivery error:', logError)
    }
    
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
