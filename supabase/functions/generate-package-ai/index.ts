
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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { description } = await req.json();

    if (!description) {
      throw new Error('Description is required');
    }

    console.log('Generating package for:', description);

    const prompt = `You are an expert package designer for MusicGift.ro, a Romanian service that creates personalized songs as gifts. 

Based on this description, create a complete package structure: "${description}"

Context about MusicGift.ro:
- Creates personalized songs based on customer stories
- Serves Romanian customers
- Offers packages like Personal (basic), Premium (with video), and Corporate (for businesses)
- Typical price ranges: Personal (300-500 RON), Premium (700-1200 RON), Corporate (1500+ RON)
- Delivery times: 3-7 days for basic, 7-14 days for premium services
- Common services: song creation, professional recording, music video, Spotify distribution

Create a professional package with 4-6 logical steps and appropriate fields. Use Romanian business context and realistic pricing.

Generate ONLY this JSON structure:
{
  "package": {
    "value": "kebab-case-name",
    "label_key": "packageDisplayName",
    "price": 500,
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
          "field_type": "text|textarea|select|checkbox|email|tel|date|url|file",
          "placeholder_key": "placeholderText",
          "required": true|false,
          "field_order": 1,
          "options": ["option1", "option2"]
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
      "tag_type": "popular|hot|new|discount|limited",
      "tag_label_key": "tagText",
      "styling_class": "bg-blue-100 text-blue-800"
    }
  ]
}

Guidelines:
- Package value: Use kebab-case (ex: "pachet-personal", "premium-video", "corporate-song")
- Price: Set realistic Romanian prices (300-2000 RON range)
- Steps: Create 4-6 logical steps (Personal Info → Story Details → Music Preferences → Delivery → Addons → Contact)
- Field types: Use appropriate types (text, email, textarea for stories, select for choices, tel for phone)
- Field names: Use camelCase Romanian field names (numeComplet, poveste, stilMuzical, etc.)
- Required fields: Mark essential fields as required (name, email, basic story info)
- Options: For select fields, provide 3-5 relevant Romanian options
- Includes: List 4-6 package features customers get
- Tags: Add 1-2 appropriate tags with proper styling classes

Field type examples:
- "text": names, short inputs
- "email": email addresses  
- "tel": phone numbers
- "textarea": stories, descriptions, special requests
- "select": predefined choices (music style, occasion, etc.)
- "date": event dates, deadlines
- "url": reference links (YouTube songs, etc.)
- "file": uploaded files (photos, audio recordings)

Example field names in Romanian context:
- "numeComplet", "email", "telefon"
- "numeDestinatar", "relatia", "ocazia"
- "poveste", "momenteCheie", "cuvinteSpeciale"
- "stilMuzical", "cantecReferinta", "limbaCantec"
- "dataEveniment", "timpLivrare", "mesajSpecial"

Respond with ONLY the JSON object, no additional text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert Romanian package designer for music gift services. Respond only with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('Generated text:', generatedText);

    let generatedData;
    try {
      let cleanedText = generatedText.trim();
      
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

    // Validate the generated data structure
    if (!generatedData.package || !generatedData.steps || !Array.isArray(generatedData.steps)) {
      throw new Error('Invalid package structure generated');
    }

    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: generation, error: insertError } = await adminSupabase
      .from('ai_package_generations')
      .insert({
        user_id: user.id,
        input_description: description,
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
