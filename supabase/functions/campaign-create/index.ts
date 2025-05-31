
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
    const { name, subject, content = '', html_content = '', target_list_ids = [] } = await req.json()

    if (!name || !subject) {
      return new Response(
        JSON.stringify({ error: 'Name and subject are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user from request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create campaign in Brevo
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    let brevo_campaign_id = null
    let brevoError = null

    if (brevoApiKey) {
      try {
        // If no list IDs provided, try to get the "identified_contacts" list
        let finalListIds = target_list_ids
        
        if (finalListIds.length === 0) {
          // Fetch available lists from Brevo to find "identified_contacts"
          const listsResponse = await fetch('https://api.brevo.com/v3/contacts/lists', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'api-key': brevoApiKey
            }
          })

          if (listsResponse.ok) {
            const listsData = await listsResponse.json()
            const identifiedContactsList = listsData.lists?.find((list: any) => 
              list.name === 'identified_contacts' || list.name.toLowerCase().includes('identified')
            )
            
            if (identifiedContactsList) {
              finalListIds = [identifiedContactsList.id]
              console.log('Found identified_contacts list with ID:', identifiedContactsList.id)
            } else {
              console.log('Available lists:', listsData.lists?.map((l: any) => ({ id: l.id, name: l.name })))
              throw new Error('No "identified_contacts" list found. Please specify target_list_ids.')
            }
          } else {
            throw new Error('Failed to fetch Brevo lists')
          }
        }

        const brevoResponse = await fetch('https://api.brevo.com/v3/emailCampaigns', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': brevoApiKey
          },
          body: JSON.stringify({
            name: name,
            subject: subject,
            type: 'classic',
            htmlContent: html_content || `<html><body>${content}</body></html>`,
            recipients: {
              listIds: finalListIds
            },
            sender: {
              name: 'MusicGift',
              email: 'noreply@musicgift.com'
            }
          })
        })

        if (brevoResponse.ok) {
          const brevoData = await brevoResponse.json()
          brevo_campaign_id = brevoData.id?.toString()
          console.log('Successfully created Brevo campaign:', brevo_campaign_id, 'with lists:', finalListIds)
        } else {
          const errorText = await brevoResponse.text()
          console.log('Brevo API error:', errorText)
          brevoError = `Brevo API error: ${errorText}`
          // Continue even if Brevo fails - we still want to store locally
        }
      } catch (error) {
        console.error('Brevo integration error:', error)
        brevoError = error.message
        // Continue even if Brevo fails
      }
    }

    // Store campaign in Supabase
    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        name,
        subject,
        content,
        html_content,
        target_list_ids,
        brevo_campaign_id,
        status: 'draft',
        created_by: user.id
      })
      .select()
      .single()

    if (error) throw error

    const response = { 
      message: 'Campaign created successfully',
      campaign: data
    }

    // Add warning if Brevo failed
    if (brevoError) {
      response.warning = `Campaign created locally but Brevo sync failed: ${brevoError}`
    }

    return new Response(
      JSON.stringify(response),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Campaign creation error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to create campaign: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
