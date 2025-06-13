
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

// Deduplicate testimonials by ID, prioritizing database testimonials
function deduplicateTestimonials(staticTestimonials: any[], databaseTestimonials: any[]): any[] {
  console.log(`Starting deduplication: ${staticTestimonials.length} static + ${databaseTestimonials.length} database testimonials`);
  
  // Create a Map to track unique testimonials by ID
  const uniqueTestimonials = new Map();
  
  // First, add all static testimonials
  let staticCount = 0;
  for (const testimonial of staticTestimonials) {
    if (testimonial.id && !uniqueTestimonials.has(testimonial.id)) {
      uniqueTestimonials.set(testimonial.id, { ...testimonial, source: 'static' });
      staticCount++;
    }
  }
  
  // Then add database testimonials, overriding any conflicts (database wins)
  let databaseCount = 0;
  let overriddenCount = 0;
  for (const dbTestimonial of databaseTestimonials) {
    const testimonial = {
      id: dbTestimonial.id,
      name: dbTestimonial.name,
      location: dbTestimonial.location,
      stars: dbTestimonial.stars,
      message: dbTestimonial.text,
      context: dbTestimonial.context,
      youtube_link: dbTestimonial.youtube_link,
      video_url: dbTestimonial.video_url,
      display_order: dbTestimonial.display_order,
      approved: dbTestimonial.approved,
      source: 'database'
    };
    
    if (uniqueTestimonials.has(testimonial.id)) {
      overriddenCount++;
      console.log(`Overriding static testimonial with database version for ID: ${testimonial.id}`);
    }
    
    uniqueTestimonials.set(testimonial.id, testimonial);
    databaseCount++;
  }
  
  // Convert back to array and remove the source property
  const result = Array.from(uniqueTestimonials.values()).map(({ source, ...testimonial }) => testimonial);
  
  console.log(`Deduplication complete: ${result.length} unique testimonials (${staticCount} static-only, ${databaseCount} database, ${overriddenCount} conflicts resolved)`);
  
  return result;
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

    console.log('Testing GitHub token authentication...');

    // First, test token authentication by getting user info
    const tokenTestResponse = await fetch(
      'https://api.github.com/user',
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Supabase-Edge-Function'
        }
      }
    );

    if (!tokenTestResponse.ok) {
      const tokenError = await tokenTestResponse.text();
      console.error('GitHub token test failed:', tokenError);
      throw new Error(`GitHub token authentication failed: ${tokenTestResponse.status} ${tokenTestResponse.statusText}`);
    }

    const tokenData = await tokenTestResponse.json();
    console.log(`GitHub token authenticated for user: ${tokenData.login}`);

    console.log('Checking repository access...');

    // Check repository access
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
      console.error('Repository access failed:', repoError);
      throw new Error(`Cannot access repository ${repoOwner}/${repoName}. Status: ${repoCheckResponse.status}. Please ensure the GitHub token has access to this repository.`);
    }

    const repoData = await repoCheckResponse.json();
    console.log(`Repository access confirmed. Default branch: ${repoData.default_branch}`);

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
          console.log(`Found ${staticTestimonials.length} testimonials in existing file (may contain duplicates)`);
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
      throw new Error(`Failed to fetch file from GitHub: ${fileResponse.status} ${fileResponse.statusText}. Error: ${errorText}`);
    }

    // Deduplicate and merge testimonials
    const allTestimonials = deduplicateTestimonials(
      staticTestimonials.filter(t => t.approved),
      supabaseTestimonials || []
    );

    // Sort by display_order
    allTestimonials.sort((a, b) => a.display_order - b.display_order);

    console.log(`Final result: ${allTestimonials.length} unique testimonials`);

    // Generate new file content
    const newFileContent = `export const testimonials = ${JSON.stringify(allTestimonials, null, 2)};`;

    // Update or create file in GitHub
    console.log(fileSha ? 'Updating existing file in GitHub repository...' : 'Creating new file in GitHub repository...');
    
    const requestBody: any = {
      message: `Auto-sync testimonials: ${allTestimonials.length} unique testimonials (deduplicated from ${staticTestimonials.length} static + ${supabaseTestimonials?.length || 0} database)`,
      content: utf8ToBase64(newFileContent),
      branch: 'main'
    };

    // Only include SHA if file exists (for updates)
    if (fileSha) {
      requestBody.sha = fileSha;
    }

    console.log('Making GitHub API request:', {
      url: `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      method: 'PUT',
      branch: requestBody.branch,
      hasAuth: !!githubToken,
      hasSha: !!fileSha,
      operation: fileSha ? 'update' : 'create'
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
      
      // Parse error response if it's JSON
      let parsedError;
      try {
        parsedError = JSON.parse(errorData);
      } catch {
        parsedError = { message: errorData };
      }
      
      // Provide more specific error messages
      if (updateResponse.status === 404) {
        throw new Error(`Repository or file path not found. This might be due to insufficient permissions.`);
      } else if (updateResponse.status === 403) {
        throw new Error(`Permission denied. The GitHub token does not have write access to ${repoOwner}/${repoName}.`);
      } else if (updateResponse.status === 422) {
        throw new Error(`Invalid request: ${parsedError.message || 'Unknown validation error'}.`);
      } else {
        throw new Error(`Failed to update file: ${updateResponse.status} ${updateResponse.statusText}. Error: ${parsedError.message || errorData}`);
      }
    }

    const updateData = await updateResponse.json();
    console.log(`Successfully ${fileSha ? 'updated' : 'created'} testimonials file in GitHub with deduplicated content`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Successfully synced ${allTestimonials.length} unique testimonials to GitHub (deduplicated)`,
      commit_url: updateData.commit?.html_url,
      testimonials_count: allTestimonials.length,
      database_count: supabaseTestimonials?.length || 0,
      static_count: staticTestimonials.length,
      duplicates_removed: (staticTestimonials.length + (supabaseTestimonials?.length || 0)) - allTestimonials.length,
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
