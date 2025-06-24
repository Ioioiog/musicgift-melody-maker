
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const webhookData = await req.json()
    console.log('Brevo webhook received:', JSON.stringify(webhookData, null, 2))

    const { event, email, date, 'message-id': messageId } = webhookData

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email not provided in webhook' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Start sync log for webhook processing
    const { data: syncLog } = await supabaseClient
      .from('newsletter_sync_log')
      .insert({
        operation_type: 'webhook_update',
        direction: 'brevo_to_local',
        status: 'running',
        records_processed: 1
      })
      .select()
      .single()

    const syncLogId = syncLog?.id

    try {
      // Find the local contact
      const { data: localContact, error: findError } = await supabaseClient
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', email)
        .single()

      if (findError && findError.code !== 'PGRST116') {
        throw findError
      }

      let updateData: any = {
        last_brevo_sync: new Date().toISOString(),
        sync_status: 'synced'
      }

      // Handle different webhook events
      switch (event) {
        case 'unsubscribed':
        case 'listUnsubscription':
          updateData.is_active = false
          updateData.updated_at = new Date().toISOString()
          console.log(`Processing unsubscribe for ${email}`)
          break
          
        case 'hardBounce':
        case 'softBounce':
          updateData.is_active = false
          updateData.updated_at = new Date().toISOString()
          console.log(`Processing bounce (${event}) for ${email}`)
          break
          
        case 'spam':
          updateData.is_active = false
          updateData.updated_at = new Date().toISOString()
          console.log(`Processing spam report for ${email}`)
          break
          
        case 'delivered':
        case 'opened':
        case 'clicked':
          // These events don't require local database updates
          console.log(`Received ${event} event for ${email} - no action needed`)
          break
          
        default:
          console.log(`Unknown webhook event: ${event}`)
          break
      }

      if (localContact) {
        // Update existing contact
        const { error: updateError } = await supabaseClient
          .from('newsletter_subscribers')
          .update(updateData)
          .eq('id', localContact.id)

        if (updateError) throw updateError
        console.log(`Updated local contact: ${email}`)
      } else if (event === 'subscribed' || event === 'listAddition') {
        // Create new contact if they subscribed via Brevo
        const { error: insertError } = await supabaseClient
          .from('newsletter_subscribers')
          .insert({
            email,
            source: 'brevo',
            is_active: true,
            ...updateData
          })

        if (insertError) throw insertError
        console.log(`Created new local contact: ${email}`)
      }

      // Update sync log with success
      if (syncLogId) {
        await supabaseClient
          .from('newsletter_sync_log')
          .update({
            status: 'completed',
            records_succeeded: 1,
            records_failed: 0,
            completed_at: new Date().toISOString()
          })
          .eq('id', syncLogId)
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Processed ${event} for ${email}` 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )

    } catch (error) {
      // Update sync log with failure
      if (syncLogId) {
        await supabaseClient
          .from('newsletter_sync_log')
          .update({
            status: 'failed',
            records_succeeded: 0,
            records_failed: 1,
            error_details: [{ email, error: error.message }],
            completed_at: new Date().toISOString()
          })
          .eq('id', syncLogId)
      }

      throw error
    }

  } catch (error) {
    console.error('Brevo webhook error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
