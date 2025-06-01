
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

    const prompt = `Create 3 different Suno.AI song generation prompts based on this music order information:

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
1. A descriptive song theme/story
2. Musical style tags (genre, tempo, instrumentation)
3. Mood and atmosphere descriptors
4. Voice specifications
5. Language instructions

Format each prompt as a complete Suno.AI prompt with proper tags and descriptions. Make them creative and unique while staying true to the order requirements.

Return the response in this JSON format:
{
  "prompts": [
    {
      "title": "Prompt 1 Title",
      "description": "Brief description of this variation",
      "prompt": "Complete Suno.AI prompt text with tags"
    },
    {
      "title": "Prompt 2 Title", 
      "description": "Brief description of this variation",
      "prompt": "Complete Suno.AI prompt text with tags"
    },
    {
      "title": "Prompt 3 Title",
      "description": "Brief description of this variation", 
      "prompt": "Complete Suno.AI prompt text with tags"
    }
  ]
}

Make the prompts engaging, emotionally resonant, and technically optimized for Suno.AI generation.`;

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
            content: 'You are an expert AI music prompt engineer specialized in creating optimized prompts for Suno.AI. Generate creative, detailed prompts that include proper musical tags, mood descriptors, and technical specifications for the best AI music generation results.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
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

    console.log('Successfully generated Suno.AI prompts');
    
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
