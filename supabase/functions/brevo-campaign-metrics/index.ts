
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

    if (!campaign.brevo_campaign_id) {
      return new Response(
        JSON.stringify({ error: 'Campaign not synced with Brevo' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    
    if (!brevoApiKey) {
      return new Response(
        JSON.stringify({ error: 'Brevo API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch campaign statistics from Brevo
    const brevoResponse = await fetch(`https://api.brevo.com/v3/emailCampaigns/${campaign.brevo_campaign_id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'api-key': brevoApiKey
      }
    })

    if (!brevoResponse.ok) {
      const errorText = await brevoResponse.text()
      console.log('Brevo API error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch campaign metrics from Brevo' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const campaignData = await brevoResponse.json()
    const stats = campaignData.statistics || {}

    console.log('Fetched Brevo campaign stats:', stats)

    // Update or insert campaign metrics
    const { data: existingMetrics } = await supabase
      .from('campaign_metrics')
      .select('*')
      .eq('campaign_id', campaignId)
      .single()

    const metricsData = {
      campaign_id: campaignId,
      opens: stats.uniqueOpens || stats.opens || 0,
      clicks: stats.uniqueClicks || stats.clicks || 0,
      bounces: (stats.hardBounces || 0) + (stats.softBounces || 0),
      unsubscribes: stats.unsubscriptions || 0,
      delivered: stats.delivered || 0,
      soft_bounces: stats.softBounces || 0,
      hard_bounces: stats.hardBounces || 0,
      spam_reports: stats.complaints || stats.spamReports || 0,
      last_updated: new Date().toISOString()
    }

    let result
    if (existingMetrics) {
      // Update existing metrics
      const { data, error } = await supabase
        .from('campaign_metrics')
        .update(metricsData)
        .eq('campaign_id', campaignId)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Insert new metrics
      const { data, error } = await supabase
        .from('campaign_metrics')
        .insert(metricsData)
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return new Response(
      JSON.stringify({ 
        message: 'Campaign metrics synced successfully',
        metrics: result
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Campaign metrics sync error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to sync campaign metrics: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
