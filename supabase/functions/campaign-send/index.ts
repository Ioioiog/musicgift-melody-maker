
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

    // Send campaign via Brevo if we have a Brevo campaign ID
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    let sendSuccess = false

    if (brevoApiKey && campaign.brevo_campaign_id) {
      try {
        const brevoResponse = await fetch(`https://api.brevo.com/v3/emailCampaigns/${campaign.brevo_campaign_id}/sendNow`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'api-key': brevoApiKey
          }
        })

        if (brevoResponse.ok) {
          sendSuccess = true
          console.log('Successfully sent Brevo campaign:', campaign.brevo_campaign_id)
        } else {
          const errorText = await brevoResponse.text()
          console.log('Brevo send error:', errorText)
          throw new Error('Failed to send campaign via Brevo')
        }
      } catch (brevoError) {
        console.error('Brevo send error:', brevoError)
        throw brevoError
      }
    } else {
      throw new Error('No Brevo campaign ID found or Brevo API key not configured')
    }

    // Update campaign status in database
    const { data: updatedCampaign, error: updateError } = await supabase
      .from('campaigns')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
