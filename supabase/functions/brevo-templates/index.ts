
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    
    if (!brevoApiKey) {
      return new Response(
        JSON.stringify({ error: 'Brevo API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch email templates from Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/templates', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'api-key': brevoApiKey
      }
    })

    if (!brevoResponse.ok) {
      const errorText = await brevoResponse.text()
      console.error('Brevo API error:', errorText)
      return new Response(
        JSON.stringify({ error: `Brevo API error: ${errorText}` }),
        { status: brevoResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const templatesData = await brevoResponse.json()
    
    // Transform the templates data to include only what we need
    const templates = templatesData.templates?.map((template: any) => ({
      id: template.id,
      name: template.name,
      subject: template.subject || '',
      isActive: template.isActive,
      tag: template.tag || '',
      createdAt: template.createdAt,
      modifiedAt: template.modifiedAt,
      htmlContent: template.htmlContent || '',
      // Add preview URL if available
      previewUrl: template.previewUrl || null,
      // Include template variables if available
      variables: template.variables || []
    })) || []

    return new Response(
      JSON.stringify({ 
        templates,
        count: templates.length 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Templates fetch error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch templates: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
