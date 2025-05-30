
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create supabase client with the user's session
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Verify the user is authenticated
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { description, price, deliveryTime, additionalRequirements } = await req.json();

    if (!description) {
      throw new Error('Description is required');
    }

    console.log('Generating package for:', { description, price, deliveryTime });

    const prompt = `You are an expert package designer for a service business. Based on the following description, generate a complete package structure with 5-6 steps and appropriate fields for each step.

Package Description: ${description}
Price: ${price ? `${price} RON` : 'Not specified'}
Delivery Time: ${deliveryTime || 'Not specified'}
Additional Requirements: ${additionalRequirements || 'None'}

Generate a JSON response with the following structure:
{
  "package": {
    "value": "kebab-case-name",
    "label_key": "packageDisplayName",
    "price": ${price || 0},
    "tagline_key": "shortTagline",
    "description_key": "detailedDescription",
    "delivery_time_key": "deliveryTimeText"
  },
  "steps": [
    {
      "step_number": 1,
      "title_key": "stepTitle",
      "step_order": 1,
      "fields": [
        {
          "field_name": "fieldName",
          "field_type": "text|textarea|select|checkbox|radio|email|phone|number|date",
          "placeholder_key": "placeholderText",
          "required": true|false,
          "field_order": 1,
          "options": ["option1", "option2"] // only for select/radio fields
        }
      ]
    }
  ],
  "includes": [
    {
      "include_key": "featureDescription",
      "include_order": 1
    }
  ],
  "tags": [
    {
      "tag_type": "popular|new|recommended",
      "tag_label_key": "tagText",
      "styling_class": "bg-blue-100 text-blue-800"
    }
  ]
}

Guidelines:
- Create 5-6 logical steps for the service
- Each step should have 3-6 relevant fields
- Use appropriate field types (text, email, select, etc.)
- Make required fields logical for the service
- Include 4-6 package features in includes
- Add 1-2 appropriate tags
- Use professional, clear naming conventions
- Ensure field names are camelCase and unique
- Make the package value URL-friendly (kebab-case)

Respond with ONLY the JSON object, no additional text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert package designer. Respond only with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('Generated text:', generatedText);

    // Parse the JSON response, handling markdown code blocks
    let generatedData;
    try {
      let cleanedText = generatedText.trim();
      
      // Remove markdown code block formatting if present
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }
      
      generatedData = JSON.parse(cleanedText.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', generatedText);
      throw new Error('Invalid JSON response from AI');
    }

    // Create a new supabase client with service role key for the insert
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store the generation request in the database
    const { data: generation, error: insertError } = await adminSupabase
      .from('ai_package_generations')
      .insert({
        user_id: user.id,
        input_description: description,
        input_price: price,
        input_delivery_time: deliveryTime,
        generated_data: generatedData,
        status: 'generated'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing generation:', insertError);
      throw insertError;
    }

    return new Response(JSON.stringify({ 
      generationId: generation.id,
      generatedData 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-package-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
