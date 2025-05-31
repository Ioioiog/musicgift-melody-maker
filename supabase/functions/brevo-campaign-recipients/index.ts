
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
    const { campaignId, actionType } = await req.json()

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

    // Determine the correct Brevo endpoint based on action type
    let endpoint = `https://api.brevo.com/v3/emailCampaigns/${campaign.brevo_campaign_id}/recipients`
    
    if (actionType) {
      switch (actionType) {
        case 'opened':
          endpoint += '/opens'
          break
        case 'clicked':
          endpoint += '/clicks'
          break
        case 'bounced':
          endpoint += '/bounces'
          break
        case 'unsubscribed':
          endpoint += '/unsubscriptions'
          break
        case 'complained':
          endpoint += '/complaints'
          break
        // 'delivered' uses the base recipients endpoint
      }
    }

    console.log('Fetching recipient data from:', endpoint)

    // Fetch recipient data from Brevo
    const brevoResponse = await fetch(endpoint, {
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
        JSON.stringify({ error: 'Failed to fetch recipient data from Brevo' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const recipientData = await brevoResponse.json()
    console.log('Fetched recipient data:', JSON.stringify(recipientData, null, 2))

    // Process and store recipient activity
    const activities = []
    const recipients = recipientData.recipients || recipientData.data || []

    for (const recipient of recipients) {
      const activity = {
        campaign_id: campaignId,
        email: recipient.email,
        action_type: actionType || 'delivered',
        action_timestamp: recipient.eventTime || recipient.timestamp || new Date().toISOString(),
        ip_address: recipient.ip || null,
        user_agent: recipient.userAgent || null,
        link_url: recipient.url || null,
        bounce_reason: recipient.reason || null
      }

      activities.push(activity)

      // Insert or update activity in database
      const { error: insertError } = await supabase
        .from('campaign_recipient_activity')
        .upsert(activity, {
          onConflict: 'campaign_id,email,action_type',
          ignoreDuplicates: false
        })

      if (insertError) {
        console.error('Error inserting activity:', insertError)
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Recipient data synced successfully',
        activities: activities,
        count: activities.length
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Recipient data sync error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to sync recipient data: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
