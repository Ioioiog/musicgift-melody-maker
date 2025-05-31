
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

    console.log('Full Brevo campaign response:', JSON.stringify(campaignData, null, 2))
    console.log('Campaign statistics object:', JSON.stringify(stats, null, 2))

    // Aggregate data from campaignStats array if available, otherwise use globalStats
    let aggregatedStats = {
      opens: 0,
      clicks: 0,
      delivered: 0,
      sent: 0,
      softBounces: 0,
      hardBounces: 0,
      unsubscriptions: 0,
      complaints: 0
    }

    if (stats.campaignStats && Array.isArray(stats.campaignStats)) {
      console.log('Using campaignStats array for aggregation')
      stats.campaignStats.forEach((listStat: any) => {
        aggregatedStats.opens += listStat.uniqueViews || listStat.viewed || 0
        aggregatedStats.clicks += listStat.uniqueClicks || listStat.clickers || 0
        aggregatedStats.delivered += listStat.delivered || 0
        aggregatedStats.sent += listStat.sent || 0
        aggregatedStats.softBounces += listStat.softBounces || 0
        aggregatedStats.hardBounces += listStat.hardBounces || 0
        aggregatedStats.unsubscriptions += listStat.unsubscriptions || 0
        aggregatedStats.complaints += listStat.complaints || 0
      })
    } else if (stats.globalStats) {
      console.log('Using globalStats as fallback')
      aggregatedStats = {
        opens: stats.globalStats.uniqueViews || stats.globalStats.viewed || 0,
        clicks: stats.globalStats.uniqueClicks || stats.globalStats.clickers || 0,
        delivered: stats.globalStats.delivered || 0,
        sent: stats.globalStats.sent || 0,
        softBounces: stats.globalStats.softBounces || 0,
        hardBounces: stats.globalStats.hardBounces || 0,
        unsubscriptions: stats.globalStats.unsubscriptions || 0,
        complaints: stats.globalStats.complaints || 0
      }
    } else {
      console.log('Using direct stats object')
      aggregatedStats = {
        opens: stats.uniqueViews || stats.viewed || stats.opens || 0,
        clicks: stats.uniqueClicks || stats.clickers || stats.clicks || 0,
        delivered: stats.delivered || 0,
        sent: stats.sent || 0,
        softBounces: stats.softBounces || 0,
        hardBounces: stats.hardBounces || 0,
        unsubscriptions: stats.unsubscriptions || 0,
        complaints: stats.complaints || 0
      }
    }

    console.log('Aggregated stats:', aggregatedStats)

    // Update or insert campaign metrics
    const { data: existingMetrics } = await supabase
      .from('campaign_metrics')
      .select('*')
      .eq('campaign_id', campaignId)
      .single()

    const metricsData = {
      campaign_id: campaignId,
      opens: aggregatedStats.opens,
      clicks: aggregatedStats.clicks,
      bounces: aggregatedStats.hardBounces + aggregatedStats.softBounces,
      unsubscribes: aggregatedStats.unsubscriptions,
      delivered: aggregatedStats.delivered,
      soft_bounces: aggregatedStats.softBounces,
      hard_bounces: aggregatedStats.hardBounces,
      spam_reports: aggregatedStats.complaints,
      last_updated: new Date().toISOString()
    }

    console.log('Metrics data to save:', metricsData)

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
        metrics: result,
        source: stats.campaignStats ? 'campaignStats' : stats.globalStats ? 'globalStats' : 'direct'
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
