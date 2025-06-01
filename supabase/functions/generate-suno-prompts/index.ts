
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
    const { orderData } = await req.json();

    if (!orderData) {
      return new Response(
        JSON.stringify({ error: 'Order data is required' }),
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

    console.log('Generating Suno.AI prompts for order:', orderData.id);

    const formData = orderData.form_data || {};
    
    // Extract relevant information from order data
    const storyDetails = formData.story || formData.personalizedStory || formData.message || '';
    const occasion = formData.occasion || '';
    const recipientName = formData.recipientName || '';
    const musicalStyle = formData.musicalStyle || formData.genre || '';
    const mood = formData.mood || formData.vibe || '';
    const voiceGender = formData.voiceGender || formData.gender || '';
    const language = formData.language || 'English';
    const keywords = formData.keywords || formData.specialRequests || '';

    const prompt = `Create 3 different Suno.AI song generation prompts with complete lyrics based on this music order information:

**Order Details:**
- Story/Message: ${storyDetails}
- Occasion: ${occasion}
- Recipient: ${recipientName}
- Musical Style: ${musicalStyle}
- Mood: ${mood}
- Voice Gender: ${voiceGender}
- Language: ${language}
- Special Keywords: ${keywords}

Generate 3 different prompt variations for Suno.AI that include:

1. **Complete song lyrics** written in ${language} that:
   - Tell the story from the order details
   - Are appropriate for the occasion (${occasion})
   - Match the emotional mood (${mood})
   - Include references to the recipient (${recipientName}) if provided
   - Follow proper verse-chorus-bridge structure
   - Maintain cultural authenticity for ${language}
   - Include rhyme schemes appropriate for the language

2. **Technical Suno.AI tags** including:
   - Musical style and genre tags
   - Tempo and rhythm indicators
   - Instrumentation specifications
   - Voice type and gender specifications
   - Language specifications
   - Mood and atmosphere descriptors

3. **Combined prompt** ready for Suno.AI that merges the lyrics with technical tags

Each variation should have a different musical approach while maintaining the core story and emotional message.

Return the response in this JSON format:
{
  "prompts": [
    {
      "title": "Prompt 1 Title",
      "description": "Brief description of this variation's musical style and approach",
      "lyrics": "Complete song lyrics in ${language} with verse-chorus-bridge structure",
      "technicalTags": "Suno.AI technical tags (genre, tempo, instruments, voice, etc.)",
      "prompt": "Complete Suno.AI prompt combining lyrics and technical tags"
    },
    {
      "title": "Prompt 2 Title", 
      "description": "Brief description of this variation's musical style and approach",
      "lyrics": "Complete song lyrics in ${language} with verse-chorus-bridge structure",
      "technicalTags": "Suno.AI technical tags (genre, tempo, instruments, voice, etc.)",
      "prompt": "Complete Suno.AI prompt combining lyrics and technical tags"
    },
    {
      "title": "Prompt 3 Title",
      "description": "Brief description of this variation's musical style and approach",
      "lyrics": "Complete song lyrics in ${language} with verse-chorus-bridge structure",
      "technicalTags": "Suno.AI technical tags (genre, tempo, instruments, voice, etc.)",
      "prompt": "Complete Suno.AI prompt combining lyrics and technical tags"
    }
  ]
}

Make the lyrics emotionally resonant, culturally appropriate for ${language}, and technically optimized for Suno.AI generation. Ensure each variation offers a different musical interpretation of the same story.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert AI music prompt engineer and lyricist specialized in creating optimized prompts for Suno.AI. You are fluent in multiple languages and can write authentic, culturally appropriate lyrics in any language. You understand song structure, rhyme schemes, and how to create emotionally compelling lyrics that work well with AI music generation. Generate creative, detailed prompts that include complete lyrics and proper technical specifications for the best AI music generation results.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI generation failed', details: errorText }),
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
        JSON.stringify({ error: 'No response generated' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Raw AI response:', aiResponse);

    let generatedPrompts;
    try {
      // Try to parse the JSON response
      generatedPrompts = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      
      // Try to extract JSON from the response if it contains additional text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          generatedPrompts = JSON.parse(jsonMatch[0]);
        } catch (secondParseError) {
          console.error('Failed to parse extracted JSON:', secondParseError);
          return new Response(
            JSON.stringify({ error: 'Invalid AI response format' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ error: 'No valid JSON found in AI response' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Validate the generated data structure
    if (!generatedPrompts.prompts || !Array.isArray(generatedPrompts.prompts)) {
      console.error('Invalid generated prompts structure:', generatedPrompts);
      return new Response(
        JSON.stringify({ error: 'Generated prompts missing required fields' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate that each prompt has the required fields including lyrics
    for (const prompt of generatedPrompts.prompts) {
      if (!prompt.title || !prompt.description || !prompt.lyrics || !prompt.technicalTags || !prompt.prompt) {
        console.error('Missing required fields in prompt:', prompt);
        return new Response(
          JSON.stringify({ error: 'Generated prompts missing required fields (lyrics, technicalTags, etc.)' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    console.log('Successfully generated Suno.AI prompts with lyrics');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        prompts: generatedPrompts.prompts 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in generate-suno-prompts function:', error);
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
