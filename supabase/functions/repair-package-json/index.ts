
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { packageData } = await req.json();

    if (!packageData) {
      return new Response(
        JSON.stringify({ error: 'Package data is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Repairing package JSON data:', JSON.stringify(packageData, null, 2));

    const prompt = `You are a JSON repair specialist for a music service package system. Please analyze and fix the following package JSON data to ensure it's compatible with the database schema and frontend requirements.

CRITICAL REQUIREMENTS:
1. field_type must be one of: "text", "email", "tel", "textarea", "select", "checkbox", "checkbox-group", "date", "url", "file", "audio-recorder"
2. tag_type must be one of: "popular", "hot", "discount", "new", "limited"
3. options for select fields must be in format: [{"value": "string", "label_key": "string"}]
4. Package value should be simple (e.g., "personal", not "pachet-personal")
5. All required fields must be present
6. Step numbers and orders should be sequential
7. Field orders should be sequential within each step

Common issues to fix:
- Fix "textare" → "textarea"
- Fix "audio_recorder" → "audio-recorder" 
- Convert simple string arrays in options to proper object format
- Standardize package values
- Fix invalid enum values
- Ensure proper field ordering
- Add missing required fields

Package data to repair:
${JSON.stringify(packageData, null, 2)}

Please return ONLY a valid JSON object with the repaired data. Do not include any explanations or markdown formatting.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a JSON repair specialist. Always respond with valid JSON only, no additional text or formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI repair failed', details: errorText }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content?.trim();

    if (!aiResponse) {
      console.error('No response from OpenAI');
      return new Response(
        JSON.stringify({ error: 'No repair response generated' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Raw AI repair response:', aiResponse);

    let repairedData;
    try {
      // Try to parse the JSON response
      repairedData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      
      // Try to extract JSON from the response if it contains additional text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          repairedData = JSON.parse(jsonMatch[0]);
        } catch (secondParseError) {
          console.error('Failed to parse extracted JSON:', secondParseError);
          return new Response(
            JSON.stringify({ error: 'Invalid AI repair response format' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ error: 'No valid JSON found in AI repair response' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Basic validation of repaired data
    if (!repairedData.value || !repairedData.label_key || typeof repairedData.price !== 'number') {
      console.error('Invalid repaired data structure:', repairedData);
      return new Response(
        JSON.stringify({ error: 'Repaired data missing required fields' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Successfully repaired package data');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        repaired_data: repairedData,
        issues_detected: [
          'Field type validation',
          'Tag type validation', 
          'Options format standardization',
          'Package value normalization',
          'Sequential ordering fixes'
        ]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in repair-package-json function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
