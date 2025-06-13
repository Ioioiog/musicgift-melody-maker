

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// UTF-8 safe base64 encoding function
function utf8ToBase64(str: string): string {
  return btoa(new TextEncoder().encode(str).reduce((data, byte) => data + String.fromCharCode(byte), ''));
}

// UTF-8 safe base64 decoding function
function base64ToUtf8(str: string): string {
  return new TextDecoder().decode(new Uint8Array([...atob(str)].map(char => char.charCodeAt(0))));
}

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
    const repoOwner = 'Ioioiog';
    const repoName = 'musicgift-melody-maker';
    const filePath = 'src/data/testimonials.ts';

    if (!githubToken) {
      throw new Error('GitHub token not configured');
    }

    console.log('Checking if repository exists...');

    // First, verify the repository exists
    const repoCheckResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}`,
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Supabase-Edge-Function'
        }
      }
    );

    if (!repoCheckResponse.ok) {
      const repoError = await repoCheckResponse.text();
      console.error('Repository check failed:', repoError);
      throw new Error(`Repository ${repoOwner}/${repoName} not found or not accessible. Please check if the repository exists and the GitHub token has the correct permissions.`);
    }

    console.log('Repository verified. Fetching current file from GitHub...');

    // Get current file content and SHA (handle if file doesn't exist)
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

    let currentContent = '';
    let fileSha = null;
    let staticTestimonials = [];

    if (fileResponse.ok) {
      // File exists, get current content
      const fileData = await fileResponse.json();
      currentContent = base64ToUtf8(fileData.content);
      fileSha = fileData.sha;
      
      console.log('Parsing current static testimonials...');

      // Extract static testimonials from current file
      try {
        const testimonialsMatch = currentContent.match(/export const testimonials = (\[[\s\S]*?\]);/);
        if (testimonialsMatch) {
          staticTestimonials = JSON.parse(testimonialsMatch[1]);
        }
      } catch (parseError) {
        console.warn('Could not parse existing testimonials, starting fresh:', parseError);
      }
    } else if (fileResponse.status === 404) {
      // File doesn't exist, we'll create it
      console.log('File does not exist, will create new file');
    } else {
      // Other error
      const errorText = await fileResponse.text();
      console.error('GitHub API Error:', errorText);
      throw new Error(`Failed to fetch file from GitHub: ${fileResponse.status} ${fileResponse.statusText}`);
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

    // Check if we need to create directories first
    if (!fileSha) {
      console.log('Checking if src/data directory structure exists...');
      
      // Try to get the src directory
      const srcDirResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/src`,
        {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Supabase-Edge-Function'
          }
        }
      );

      if (!srcDirResponse.ok && srcDirResponse.status === 404) {
        console.log('src directory does not exist. Creating directory structure may be needed.');
        throw new Error('The src/data directory structure does not exist in the repository. Please create the src/data directories manually in your GitHub repository first.');
      }
    }

    // Update or create file in GitHub
    console.log(fileSha ? 'Updating existing file in GitHub repository...' : 'Creating new file in GitHub repository...');
    
    const requestBody: any = {
      message: `Auto-sync testimonials: ${allTestimonials.length} total (${supabaseTestimonials?.length || 0} from database)`,
      content: utf8ToBase64(newFileContent),
      branch: 'main'
    };

    // Only include SHA if file exists (for updates)
    if (fileSha) {
      requestBody.sha = fileSha;
    }

    console.log('Making GitHub API request with:', {
      url: `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      method: 'PUT',
      hasAuth: !!githubToken,
      hasSha: !!fileSha
    });

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
        body: JSON.stringify(requestBody)
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.text();
      console.error('GitHub update failed:', updateResponse.status, updateResponse.statusText);
      console.error('GitHub error response:', errorData);
      
      // Provide more specific error messages
      if (updateResponse.status === 404) {
        throw new Error(`Repository or file path not found. Please verify that the repository '${repoOwner}/${repoName}' exists and the GitHub token has write access to it.`);
      } else if (updateResponse.status === 403) {
        throw new Error('Permission denied. Please check that your GitHub token has write access to the repository.');
      } else if (updateResponse.status === 422) {
        throw new Error('Invalid request. This might be due to branch protection rules or invalid file content.');
      } else {
        throw new Error(`Failed to update file in GitHub: ${updateResponse.status} ${updateResponse.statusText}. Error: ${errorData}`);
      }
    }

    const updateData = await updateResponse.json();
    console.log(`Successfully ${fileSha ? 'updated' : 'created'} testimonials file in GitHub`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Successfully synced ${allTestimonials.length} testimonials to GitHub`,
      commit_url: updateData.commit?.html_url,
      testimonials_count: allTestimonials.length,
      database_count: supabaseTestimonials?.length || 0,
      static_count: staticTestimonials.length,
      action: fileSha ? 'updated' : 'created'
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

