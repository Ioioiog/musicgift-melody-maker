
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestimonialSubmissionData {
  name: string;
  location?: string;
  stars: number;
  text: string;
  youtube_link?: string;
  video_url?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, location, stars, text, youtube_link, video_url }: TestimonialSubmissionData = await req.json();

    console.log('Received testimonial submission:', { name, location, stars });

    // Validate required fields
    if (!name || !text || !stars) {
      return new Response(
        JSON.stringify({ error: 'Name, testimonial text, and rating are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate stars rating
    if (stars < 1 || stars > 5) {
      return new Response(
        JSON.stringify({ error: 'Rating must be between 1 and 5 stars' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the email account for ilincagruia@musicgift.ro
    const { data: emailAccount, error: accountError } = await supabase
      .from('email_accounts')
      .select('id')
      .eq('email_address', 'ilincagruia@musicgift.ro')
      .single();

    if (accountError || !emailAccount) {
      console.error('Email account not found:', accountError);
      return new Response(
        JSON.stringify({ error: 'Email account configuration not found' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate star display
    const starDisplay = '★'.repeat(stars) + '☆'.repeat(5 - stars);
    
    // Prepare email content
    const subject = `New Testimonial Submission: ${stars} stars from ${name}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
          New Testimonial Submission
        </h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #f97316; margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
          <p><strong>Rating:</strong> ${starDisplay} (${stars}/5)</p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border-left: 4px solid #f97316; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Testimonial</h3>
          <p style="line-height: 1.6; white-space: pre-wrap;">"${text}"</p>
        </div>
        
        ${youtube_link ? `
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <h4 style="color: #dc2626; margin-top: 0;">YouTube Link</h4>
          <p><a href="${youtube_link}" target="_blank" style="color: #dc2626;">${youtube_link}</a></p>
        </div>
        ` : ''}
        
        ${video_url ? `
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h4 style="color: #1d4ed8; margin-top: 0;">Uploaded Video</h4>
          <p><a href="${video_url}" target="_blank" style="color: #1d4ed8;">View uploaded video</a></p>
        </div>
        ` : ''}
        
        <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; margin-top: 30px;">
          <h4 style="color: #333; margin-top: 0;">Code to Add to testimonials.ts</h4>
          <div style="background-color: #1f2937; color: #f9fafb; padding: 15px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 12px; overflow-x: auto;">
{
  id: '${crypto.randomUUID()}',
  name: '${name}',${location ? `\n  location: '${location}',` : ''}
  stars: ${stars},
  message: \`${text}\`,${youtube_link ? `\n  youtube_link: '${youtube_link}',` : ''}${video_url ? `\n  video_url: '${video_url}',` : ''}
  display_order: 0,
  approved: false, // Set to true to make it visible
}
          </div>
        </div>
        
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; font-size: 12px; color: #666;">
            This testimonial was submitted through the MusicGift website testimonial form.
            Review the content and add it to the static testimonials data if approved.
          </p>
        </div>
      </div>
    `;

    // Send email via SMTP using the smtp-send-email function
    const { data: emailResult, error: emailError } = await supabase.functions.invoke('smtp-send-email', {
      body: {
        accountId: emailAccount.id,
        to: ['ilincagruia@musicgift.ro'],
        subject: subject,
        bodyHtml: htmlContent
      }
    });

    if (emailError) {
      console.error('SMTP send error:', emailError);
      throw new Error('Failed to send testimonial email via SMTP');
    }

    console.log('Testimonial email sent successfully via SMTP:', emailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Testimonial submitted successfully',
        messageId: emailResult?.messageId 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in send-testimonial-email function:', error);
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
