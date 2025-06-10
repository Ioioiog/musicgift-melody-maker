
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

    // Extract event data from Brevo webhook payload
    // Brevo sends 'id' instead of 'message-id'
    const { event, email, id: messageId, date, reason, link } = webhookData

    if (!messageId || !email) {
      console.log('Missing required fields in webhook payload')
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Map Brevo event types to our delivery statuses
    const getDeliveryStatus = (eventType: string) => {
      switch (eventType) {
        case 'delivered': return 'delivered'
        case 'opened': return 'opened'
        case 'click': return 'clicked'
        case 'hardBounce': return 'hard_bounced'
        case 'softBounce': return 'soft_bounced'
        case 'blocked': return 'bounced'
        case 'unsubscribed': return 'unsubscribed'
        case 'spam': return 'failed'
        default: return null
      }
    }

    const deliveryStatus = getDeliveryStatus(event)
    if (!deliveryStatus) {
      console.log(`Unhandled event type: ${event}`)
      return new Response(JSON.stringify({ message: 'Event type not handled' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Prepare update data
    const updateData: any = {
      delivery_status: deliveryStatus,
      updated_at: new Date().toISOString(),
    }

    // Add event-specific data
    if (event === 'delivered') {
      updateData.delivered_at = date || new Date().toISOString()
    } else if (event === 'opened') {
      updateData.opened_at = date || new Date().toISOString()
      updateData.engagement_score = 1
    } else if (event === 'click') {
      updateData.clicked_at = date || new Date().toISOString()
      updateData.engagement_score = 2
    } else if (event === 'hardBounce' || event === 'softBounce' || event === 'blocked') {
      updateData.bounce_reason = reason || 'Unknown bounce reason'
    }

    // Update the email delivery record using the correct message ID field
    const { data, error } = await supabaseClient
      .from('discount_email_deliveries')
      .update(updateData)
      .eq('brevo_message_id', messageId.toString())
      .eq('recipient_email', email)
      .select()

    if (error) {
      console.error('Error updating email delivery status:', error)
      return new Response(JSON.stringify({ error: 'Database update failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!data || data.length === 0) {
      console.log(`No matching email delivery record found for message ID: ${messageId}, email: ${email}`)
      return new Response(JSON.stringify({ message: 'No matching record found' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log(`Successfully updated email delivery status for ${email}: ${deliveryStatus}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email status updated successfully',
        updated_records: data.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
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
      },
    )
  }
})
