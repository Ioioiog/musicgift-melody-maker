
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

    const prompt = `Ești un expert în crearea de pachete pentru MusicGift.ro, un serviciu românesc care creează cântece personalizate ca și cadouri.

Bazat pe această descriere, creează o structură completă de pachet: "${description}"

Context despre MusicGift.ro:
- Creează cântece personalizate bazate pe poveștile clienților
- Servește clienți din România
- Oferă pachete precum Personal (de bază), Premium (cu video), și Corporate (pentru afaceri)
- Preturi tipice: Personal (300-500 RON), Premium (700-1200 RON), Corporate (1500+ RON)
- Timpi de livrare: 3-7 zile pentru servicii de bază, 7-14 zile pentru servicii premium
- Servicii comune: crearea cântecului, înregistrare profesională, videoclip muzical, distribuție Spotify

FOARTE IMPORTANT pentru placeholder-uri:
- Creează placeholder-uri concrete și utile în română
- Pentru nume: "ex. Maria Popescu" sau "ex. Ion Georgescu"
- Pentru email: "ex. maria.popescu@email.com"
- Pentru telefon: "ex. +40712345678" 
- Pentru povești: "Povestiți-ne despre relația voastră, momentele speciale împărțite, ce îl/o face unică..."
- Pentru date: "Selectați data evenimentului"
- Pentru select-uri: pune opțiuni concrete românești
- Pentru textarea: oferă exemple concrete de ce să scrie clientul
- Pentru URL-uri: "ex. https://www.youtube.com/watch?v=..."

IMPORTANT - NU CREA CÂMP "package" în pași:
- Câmpul "package" este gestionat automat de sistem
- Nu include field_name: "package" în niciun pas
- Pașii trebuie să conțină doar câmpurile specifice pachetului

Creează un pachet profesional cu 4-6 pași logici și câmpuri adecvate. Folosește contextul de afaceri românesc și prețuri realiste.

Generează DOAR această structură JSON:
{
  "package": {
    "value": "kebab-case-name",
    "label_key": "Nume Pachet Profesional",
    "price": 500,
    "tagline_key": "Slogan scurt și atractiv",
    "description_key": "Descriere detaliată a pachetului",
    "delivery_time_key": "Text timp livrare"
  },
  "steps": [
    {
      "step_number": 1,
      "title_key": "Titlu Pas",
      "step_order": 1,
      "fields": [
        {
          "field_name": "fieldName",
          "field_type": "text|textarea|select|checkbox|email|tel|date|url|file",
          "placeholder_key": "Placeholder concret și util",
          "required": true|false,
          "field_order": 1,
          "options": ["Opțiunea 1", "Opțiunea 2"]
        }
      ]
    }
  ],
  "includes": [
    {
      "include_key": "Descriere clară a beneficiului",
      "include_order": 1
    }
  ],
  "tags": [
    {
      "tag_type": "popular|hot|new|discount|limited",
      "tag_label_key": "Text Tag",
      "styling_class": "bg-blue-100 text-blue-800"
    }
  ]
}

Instrucțiuni specifice:
- Package value: Folosește kebab-case românesc (ex: "pachet-nunta", "premium-corporate", "cadou-aniversare")
- Preț: Stabilește prețuri realiste românești (300-2000 RON)
- Pași: Creează 4-6 pași logici (Info Personale → Detalii Poveste → Preferințe Muzicale → Livrare → Contact)
- Tipuri câmpuri: Folosește tipuri adecvate (text, email, textarea pentru povești, select pentru alegeri, tel pentru telefon)
- Nume câmpuri: Folosește camelCase românesc (numeComplet, poveste, stilMuzical, etc.) - FĂRĂ "package"
- Câmpuri obligatorii: Marchează câmpurile esențiale ca required (nume, email, informații de bază)
- Opțiuni: Pentru câmpurile select, oferă 3-5 opțiuni românești relevante
- Include-uri: Listează 4-6 beneficii concrete ale pachetului
- Tag-uri: Adaugă 1-2 tag-uri potrivite cu clase de styling corecte

Exemple de placeholder-uri bune:
- "numeComplet": "ex. Maria Popescu"
- "email": "ex. maria.popescu@gmail.com"
- "telefon": "ex. +40712345678"
- "poveste": "Povestiți-ne despre relația voastră, momentele speciale împărțite, ce vă face unici..."
- "stilMuzical": "Alegeți stilul preferat..."
- "dataEveniment": "Selectați data evenimentului special"
- "cantecReferinta": "ex. https://www.youtube.com/watch?v=dQw4w9WgXcQ"

Pentru select-uri, opțiuni românești concrete:
- Relații: ["Soț/Soție", "Iubit/Iubită", "Prieten/Prietenă", "Familie", "Altele"]
- Ocazii: ["Nuntă", "Aniversare", "Ziua Îndrăgostiților", "Sărbători", "Altele"]
- Stiluri muzicale: ["Pop Românesc", "Rock", "Manele", "Folk", "Jazz", "Clasic"]
- Limba: ["Română", "Engleză", "Maghiară", "Germană"]

Răspunde DOAR cu obiectul JSON, fără text suplimentar.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Ești un expert designer de pachete pentru servicii de muzică personalizată din România. Răspunde doar cu JSON valid și placeholder-uri foarte utile și concrete. NU crea câmpuri "package" în pași.' },
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

    // Additional validation: ensure no "package" fields in steps
    generatedData.steps.forEach((step, stepIndex) => {
      if (step.fields && Array.isArray(step.fields)) {
        step.fields = step.fields.filter(field => field.field_name !== 'package');
        if (step.fields.length === 0) {
          console.warn(`Step ${stepIndex + 1} has no fields after filtering out package field`);
        }
      }
    });

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
