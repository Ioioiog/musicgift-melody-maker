
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  post_id: string;
  session_id?: string;
  referrer?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { post_id, session_id, referrer }: RequestBody = await req.json();

    if (!post_id) {
      return new Response(
        JSON.stringify({ error: 'post_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client info
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = req.headers.get('user-agent') || '';

    // Check for duplicate views in the last hour from same session/IP
    if (session_id) {
      const { data: recentView } = await supabase
        .from('blog_post_views')
        .select('id')
        .eq('blog_post_id', post_id)
        .eq('session_id', session_id)
        .gte('viewed_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
        .limit(1);

      if (recentView && recentView.length > 0) {
        console.log(`Duplicate view prevented for post ${post_id} from session ${session_id}`);
        return new Response(
          JSON.stringify({ success: true, message: 'View already counted recently' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Get current user if authenticated
    const authHeader = req.headers.get('authorization');
    let userId = null;
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id || null;
    }

    // Insert detailed view record
    const { error: viewError } = await supabase
      .from('blog_post_views')
      .insert({
        blog_post_id: post_id,
        ip_address: clientIP,
        user_agent: userAgent,
        referrer: referrer || null,
        session_id: session_id || null,
        user_id: userId
      });

    if (viewError) {
      console.error('Error inserting view record:', viewError);
    }

    // Increment the views counter on the blog post
    const { error: updateError } = await supabase.rpc('increment_blog_post_views', {
      post_id: post_id
    });

    if (updateError) {
      console.error('Error incrementing views:', updateError);
      
      // Fallback: direct update if RPC fails
      const { error: fallbackError } = await supabase
        .from('blog_posts')
        .update({ 
          views: supabase.rpc('coalesce', { val: 'views', default_val: 0 }) + 1
        })
        .eq('id', post_id);

      if (fallbackError) {
        console.error('Fallback update failed:', fallbackError);
        return new Response(
          JSON.stringify({ error: 'Failed to increment views' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log(`View incremented for blog post: ${post_id}`);
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
