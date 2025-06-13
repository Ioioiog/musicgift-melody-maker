
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user is authenticated and has admin role
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user has admin role
    const { data: userRole } = await supabaseClient
      .rpc('get_user_role', { _user_id: user.id });
    
    if (!userRole || !['admin', 'super_admin'].includes(userRole)) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Fetching testimonials from database...');

    // Fetch all approved testimonials from Supabase
    const { data: supabaseTestimonials, error: testimonialsError } = await supabaseClient
      .from('testimonials')
      .select('*')
      .eq('approved', true)
      .order('display_order');

    if (testimonialsError) {
      console.error('Error fetching testimonials:', testimonialsError);
      throw new Error('Failed to fetch testimonials');
    }

    console.log(`Fetched ${supabaseTestimonials?.length || 0} approved testimonials`);

    // Get the current static testimonials from GitHub
    const githubToken = Deno.env.get('GITHUB_TOKEN');
    const repoOwner = 'your-github-username'; // Replace with your GitHub username
    const repoName = 'your-repo-name'; // Replace with your repository name
    const filePath = 'src/data/testimonials.ts';

    if (!githubToken) {
      throw new Error('GitHub token not configured');
    }

    console.log('Fetching current file from GitHub...');

    // Get current file content and SHA
    const fileResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Supabase-Edge-Function'
        }
      }
    );

    if (!fileResponse.ok) {
      const errorText = await fileResponse.text();
      console.error('GitHub API Error:', errorText);
      throw new Error(`Failed to fetch file from GitHub: ${fileResponse.status} ${fileResponse.statusText}`);
    }

    const fileData = await fileResponse.json();
    const currentContent = atob(fileData.content);
    
    console.log('Parsing current static testimonials...');

    // Extract static testimonials from current file
    let staticTestimonials = [];
    try {
      const testimonialsMatch = currentContent.match(/export const testimonials = (\[[\s\S]*?\]);/);
      if (testimonialsMatch) {
        staticTestimonials = JSON.parse(testimonialsMatch[1]);
      }
    } catch (parseError) {
      console.warn('Could not parse existing testimonials, starting fresh:', parseError);
    }

    // Combine static testimonials with approved Supabase testimonials
    const allTestimonials = [
      ...staticTestimonials.filter(t => t.approved),
      ...(supabaseTestimonials || []).map(t => ({
        id: t.id,
        name: t.name,
        location: t.location,
        stars: t.stars,
        message: t.text,
        context: t.context,
        youtube_link: t.youtube_link,
        video_url: t.video_url,
        display_order: t.display_order,
        approved: t.approved
      }))
    ];

    // Sort by display_order
    allTestimonials.sort((a, b) => a.display_order - b.display_order);

    console.log(`Combining ${staticTestimonials.length} static + ${supabaseTestimonials?.length || 0} database testimonials`);

    // Generate new file content
    const newFileContent = `export const testimonials = ${JSON.stringify(allTestimonials, null, 2)};`;

    // Update file in GitHub
    console.log('Updating file in GitHub repository...');
    
    const updateResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Supabase-Edge-Function'
        },
        body: JSON.stringify({
          message: `Auto-sync testimonials: ${allTestimonials.length} total (${supabaseTestimonials?.length || 0} from database)`,
          content: btoa(newFileContent),
          sha: fileData.sha,
          branch: 'main'
        })
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.text();
      console.error('GitHub update failed:', errorData);
      throw new Error(`Failed to update file in GitHub: ${updateResponse.status} ${updateResponse.statusText}`);
    }

    const updateData = await updateResponse.json();
    console.log('Successfully updated testimonials file in GitHub');

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Successfully synced ${allTestimonials.length} testimonials to GitHub`,
      commit_url: updateData.commit?.html_url,
      testimonials_count: allTestimonials.length,
      database_count: supabaseTestimonials?.length || 0,
      static_count: staticTestimonials.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in update-testimonials-file function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
