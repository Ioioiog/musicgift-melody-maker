
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
    const { input_description, input_price, input_delivery_time } = await req.json();

    if (!input_description?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Description is required' }),
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

    console.log('Generating package for description:', input_description);
    console.log('Price:', input_price, 'Delivery time:', input_delivery_time);

    const prompt = `Create a music service package configuration based on the following description:

Description: ${input_description}
${input_price ? `Price: ${input_price} RON` : ''}
${input_delivery_time ? `Delivery time: ${input_delivery_time}` : ''}

Generate a JSON response with this EXACT structure (no additional text or formatting):

{
  "package_info": {
    "value": "unique-package-name",
    "label_key": "packageName",
    "price": ${input_price || 100},
    "tagline_key": "packageTagline",
    "description_key": "packageDescription",
    "delivery_time_key": "deliveryTime"
  },
  "tags": [
    {
      "tag_type": "popular",
      "tag_label_key": "tagLabel",
      "styling_class": "bg-purple-100 text-purple-700"
    }
  ],
  "includes": [
    {
      "include_key": "includeItem1",
      "include_order": 1
    },
    {
      "include_key": "includeItem2", 
      "include_order": 2
    }
  ],
  "steps": [
    {
      "step_number": 1,
      "title_key": "stepTitle",
      "step_order": 1,
      "fields": [
        {
          "field_name": "fieldName",
          "field_type": "text",
          "placeholder_key": "placeholderKey",
          "required": true,
          "field_order": 1
        }
      ]
    }
  ],
  "translations": {
    "en": {
      "packageName": "Package Name",
      "packageTagline": "Package tagline",
      "packageDescription": "Package description",
      "deliveryTime": "Delivery timeframe",
      "tagLabel": "Tag label",
      "includeItem1": "First included item",
      "includeItem2": "Second included item",
      "stepTitle": "Step title",
      "placeholderKey": "Field placeholder"
    },
    "ro": {
      "packageName": "Nume pachet",
      "packageTagline": "Slogan pachet",
      "packageDescription": "Descriere pachet",
      "deliveryTime": "Timp de livrare",
      "tagLabel": "Etichetă",
      "includeItem1": "Primul element inclus",
      "includeItem2": "Al doilea element inclus",
      "stepTitle": "Titlu pas",
      "placeholderKey": "Placeholder câmp"
    }
  }
}

Valid field_type values: text, email, tel, textarea, select, checkbox, checkbox-group, date, url, file, audio-recorder
Valid tag_type values: popular, hot, discount, new, limited

Make the package relevant to music production services. Include 2-4 steps with appropriate fields for gathering customer information.`;

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
            content: 'You are a helpful assistant that generates structured JSON data for music service packages. Always respond with valid JSON only, no additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
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

    let generatedData;
    try {
      // Try to parse the JSON response
      generatedData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.log('Attempting to extract JSON from response...');
      
      // Try to extract JSON from the response if it contains additional text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          generatedData = JSON.parse(jsonMatch[0]);
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
    if (!generatedData.package_info || !generatedData.steps || !generatedData.translations) {
      console.error('Invalid generated data structure:', generatedData);
      return new Response(
        JSON.stringify({ error: 'Generated data missing required fields' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Successfully generated and validated package data');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        generated_data: generatedData 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in generate-package-ai function:', error);
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
