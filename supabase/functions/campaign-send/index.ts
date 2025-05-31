
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
    const { campaignId } = await req.json()

    if (!campaignId) {
      return new Response(
        JSON.stringify({ error: 'Campaign ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get campaign from database
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single()

    if (campaignError || !campaign) {
      return new Response(
        JSON.stringify({ error: 'Campaign not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (campaign.status !== 'draft') {
      return new Response(
        JSON.stringify({ error: 'Campaign must be in draft status to send' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    let sendSuccess = false
    let actualBrevoId = campaign.brevo_campaign_id

    // If no Brevo campaign ID, try to create one first
    if (!actualBrevoId && brevoApiKey) {
      try {
        console.log('No Brevo campaign ID found, attempting to create campaign in Brevo...')
        
        // Get available lists first
        const listsResponse = await fetch('https://api.brevo.com/v3/contacts/lists', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'api-key': brevoApiKey
          }
        })

        let targetListIds = campaign.target_list_ids || []
        
        if (listsResponse.ok && targetListIds.length === 0) {
          const listsData = await listsResponse.json()
          const identifiedContactsList = listsData.lists?.find((list: any) => 
            list.name === 'identified_contacts' || list.name.toLowerCase().includes('identified')
          )
          
          if (identifiedContactsList) {
            targetListIds = [identifiedContactsList.id]
            console.log('Using identified_contacts list with ID:', identifiedContactsList.id)
          }
        }

        if (targetListIds.length === 0) {
          throw new Error('No target lists available for campaign')
        }

        const brevoResponse = await fetch('https://api.brevo.com/v3/emailCampaigns', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': brevoApiKey
          },
          body: JSON.stringify({
            name: campaign.name,
            subject: campaign.subject,
            type: 'classic',
            htmlContent: campaign.html_content || `<html><body>${campaign.content}</body></html>`,
            recipients: {
              listIds: targetListIds
            },
            sender: {
              name: 'MusicGift',
              email: 'noreply@musicgift.com'
            }
          })
        })

        if (brevoResponse.ok) {
          const brevoData = await brevoResponse.json()
          actualBrevoId = brevoData.id?.toString()
          console.log('Successfully created Brevo campaign:', actualBrevoId)
          
          // Update the campaign with the Brevo ID
          await supabase
            .from('campaigns')
            .update({ 
              brevo_campaign_id: actualBrevoId,
              target_list_ids: targetListIds
            })
            .eq('id', campaignId)
        } else {
          const errorText = await brevoResponse.text()
          console.log('Failed to create Brevo campaign:', errorText)
          throw new Error(`Failed to create campaign in Brevo: ${errorText}`)
        }
      } catch (createError) {
        console.error('Failed to create Brevo campaign:', createError)
        throw new Error(`Cannot send campaign without Brevo integration: ${createError.message}`)
      }
    }

    // Send campaign via Brevo if we have a Brevo campaign ID
    if (brevoApiKey && actualBrevoId) {
      try {
        const brevoResponse = await fetch(`https://api.brevo.com/v3/emailCampaigns/${actualBrevoId}/sendNow`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'api-key': brevoApiKey
          }
        })

        if (brevoResponse.ok) {
          sendSuccess = true
          console.log('Successfully sent Brevo campaign:', actualBrevoId)
        } else {
          const errorText = await brevoResponse.text()
          console.log('Brevo send error:', errorText)
          throw new Error(`Failed to send campaign via Brevo: ${errorText}`)
        }
      } catch (brevoError) {
        console.error('Brevo send error:', brevoError)
        throw brevoError
      }
    } else {
      throw new Error('No Brevo campaign ID found and Brevo API key not configured')
    }

    // Update campaign status in database
    const { data: updatedCampaign, error: updateError } = await supabase
      .from('campaigns')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        brevo_campaign_id: actualBrevoId
      })
      .eq('id', campaignId)
      .select()
      .single()

    if (updateError) throw updateError

    // Initialize campaign metrics
    const { error: metricsError } = await supabase
      .from('campaign_metrics')
      .insert({
        campaign_id: campaignId,
        opens: 0,
        clicks: 0,
        bounces: 0,
        unsubscribes: 0,
        delivered: 0,
        soft_bounces: 0,
        hard_bounces: 0,
        spam_reports: 0
      })

    if (metricsError) {
      console.error('Failed to initialize campaign metrics:', metricsError)
    }

    return new Response(
      JSON.stringify({ 
        message: 'Campaign sent successfully',
        campaign: updatedCampaign
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Campaign send error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to send campaign: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
