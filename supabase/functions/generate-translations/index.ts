
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

    const { translationKeys } = await req.json();

    if (!translationKeys || !Array.isArray(translationKeys)) {
      throw new Error('Translation keys array is required');
    }

    console.log('Generating translations for keys:', translationKeys);

    const prompt = `You are a professional translator for a Romanian music gift service called MusicGift.ro. 

Generate Romanian translations for the following translation keys. The service creates personalized songs as gifts.

Translation keys to translate: ${JSON.stringify(translationKeys)}

Guidelines:
- Use natural, marketing-friendly Romanian language
- Keep the tone warm, emotional, and professional
- Use "tu" form for addressing customers
- For package names, use descriptive but concise names
- For taglines, make them emotional and compelling
- For descriptions, be detailed but not overly long
- For field placeholders, be clear and helpful
- For delivery times, use standard Romanian business language

Return ONLY a JSON object in this exact format:
{
  "translations": [
    {
      "key_name": "translation_key",
      "translation": "Romanian translation"
    }
  ]
}

Examples of good translations:
- "personalPackage" -> "Pachet Personal"
- "premiumTagline" -> "Cel mai frumos cadou pentru persoana iubită"
- "deliveryTime7Days" -> "7-10 zile lucrătoare"
- "recipientNamePlaceholder" -> "Numele destinatarului (ex: Maria Popescu)"`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional Romanian translator. Respond only with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('Generated translations text:', generatedText);

    let translationsData;
    try {
      let cleanedText = generatedText.trim();
      
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }
      
      translationsData = JSON.parse(cleanedText.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', generatedText);
      throw new Error('Invalid JSON response from AI');
    }

    // Save translations to database
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);
    
    for (const translation of translationsData.translations) {
      const { error: upsertError } = await adminSupabase
        .from('translations')
        .upsert({
          key_name: translation.key_name,
          language_code: 'ro',
          translation: translation.translation
        }, {
          onConflict: 'key_name,language_code'
        });

      if (upsertError) {
        console.error('Error saving translation:', upsertError);
      } else {
        console.log('Saved translation:', translation.key_name, '->', translation.translation);
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      translations: translationsData.translations
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-translations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
