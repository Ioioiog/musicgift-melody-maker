
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
    const { 
      name, 
      subject, 
      content = '', 
      html_content = '', 
      target_list_ids = [], 
      sender_email, 
      sender_name,
      template_id,
      template_variables = {}
    } = await req.json()

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

        // Get verified senders to use a valid one
        let senderInfo = {
          name: sender_name || 'MusicGift',
          email: sender_email || 'noreply@musicgift.com'
        }

        // Try to get verified senders from Brevo
        const sendersResponse = await fetch('https://api.brevo.com/v3/senders', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'api-key': brevoApiKey
          }
        })

        if (sendersResponse.ok) {
          const sendersData = await sendersResponse.json()
          const verifiedSenders = sendersData.senders?.filter((sender: any) => sender.active)
          
          if (verifiedSenders && verifiedSenders.length > 0) {
            // Use the first verified sender if no custom sender provided
            if (!sender_email) {
              senderInfo = {
                name: verifiedSenders[0].name || 'MusicGift',
                email: verifiedSenders[0].email
              }
              console.log('Using verified sender:', senderInfo)
            }
          } else {
            console.log('No verified senders found in Brevo')
          }
        }

        // Prepare campaign data for Brevo
        const campaignPayload: any = {
          name: name,
          subject: subject,
          type: 'classic',
          recipients: {
            listIds: finalListIds
          },
          sender: senderInfo
        }

        // Use template or HTML content
        if (template_id) {
          campaignPayload.templateId = parseInt(template_id)
          // Add template parameters if provided
          if (Object.keys(template_variables).length > 0) {
            campaignPayload.params = template_variables
          }
          console.log('Creating campaign with template ID:', template_id, 'and variables:', template_variables)
        } else {
          campaignPayload.htmlContent = html_content || `<html><body>${content}</body></html>`
        }

        const brevoResponse = await fetch('https://api.brevo.com/v3/emailCampaigns', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': brevoApiKey
          },
          body: JSON.stringify(campaignPayload)
        })

        if (brevoResponse.ok) {
          const brevoData = await brevoResponse.json()
          brevo_campaign_id = brevoData.id?.toString()
          console.log('Successfully created Brevo campaign:', brevo_campaign_id, 'with lists:', finalListIds, 'and sender:', senderInfo)
        } else {
          const errorText = await brevoResponse.text()
          console.log('Brevo API error:', errorText)
          
          // Provide specific error messages for common issues
          if (errorText.includes('Sender is invalid') || errorText.includes('inactive')) {
            brevoError = `Sender email "${senderInfo.email}" is not verified in Brevo. Please verify your sender email in your Brevo account under Senders & IP → Senders.`
          } else if (errorText.includes('list ids are not valid')) {
            brevoError = `Invalid list IDs: ${finalListIds.join(', ')}. Please check your Brevo contact lists.`
          } else if (errorText.includes('template')) {
            brevoError = `Template error: ${errorText}. Please check if the template ID ${template_id} exists and is active.`
          } else {
            brevoError = `Brevo API error: ${errorText}`
          }
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
        template_id,
        template_variables,
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
