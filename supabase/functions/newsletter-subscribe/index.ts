import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, name = '', source = 'website' } = await req.json()

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email)
      .single()

    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return new Response(
          JSON.stringify({ message: 'Email already subscribed' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        // Reactivate existing subscriber
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({ is_active: true, updated_at: new Date().toISOString() })
          .eq('id', existingSubscriber.id)

        if (updateError) throw updateError

        return new Response(
          JSON.stringify({ message: 'Successfully resubscribed to newsletter' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Add to Brevo
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    let brevoContactId = null
    let brevoListId = null

    if (brevoApiKey) {
      try {
        // First, fetch available lists to find "MusicGift"
        const listsResponse = await fetch('https://api.brevo.com/v3/contacts/lists', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'api-key': brevoApiKey
          }
        })

        if (listsResponse.ok) {
          const listsData = await listsResponse.json()
          console.log('Available Brevo lists:', JSON.stringify(listsData.lists, null, 2))
          
          // Find the list with name "MusicGift"
          const targetList = listsData.lists?.find((list: any) => 
            list.name === 'MusicGift'
          )
          
          if (targetList) {
            brevoListId = targetList.id
            console.log('Found MusicGift list with ID:', brevoListId)
          } else {
            console.log('MusicGift list not found, using default list ID 1')
            brevoListId = 1
          }
        } else {
          console.log('Failed to fetch Brevo lists, using default list ID 1')
          brevoListId = 1
        }

        // Add contact to Brevo with the correct list ID
        const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': brevoApiKey
          },
          body: JSON.stringify({
            email: email,
            attributes: {
              FIRSTNAME: name || '',
              SOURCE: source
            },
            listIds: [brevoListId],
            updateEnabled: true
          })
        })

        if (brevoResponse.ok) {
          const brevoData = await brevoResponse.json()
          brevoContactId = brevoData.id?.toString()
          console.log('Successfully added to Brevo list', brevoListId, 'with contact ID:', brevoContactId)
        } else {
          const errorText = await brevoResponse.text()
          console.log('Brevo API error:', errorText)
          // Continue even if Brevo fails - we still want to store locally
        }
      } catch (brevoError) {
        console.error('Brevo integration error:', brevoError)
        // Continue even if Brevo fails
      }
    }

    // Store in Supabase
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        name: name || null,
        source,
        brevo_contact_id: brevoContactId,
        is_active: true
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        message: 'Successfully subscribed to newsletter',
        id: data.id,
        brevo_list_id: brevoListId
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to subscribe to newsletter' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
