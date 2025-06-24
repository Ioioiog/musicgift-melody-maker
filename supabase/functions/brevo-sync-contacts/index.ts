
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BrevoContact {
  id: number;
  email: string;
  attributes: {
    FIRSTNAME?: string;
    LASTNAME?: string;
    [key: string]: any;
  };
  listIds: number[];
  emailBlacklisted: boolean;
  smsBlacklisted: boolean;
  createdAt: string;
  modifiedAt: string;
}

interface SyncOptions {
  direction: 'brevo_to_local' | 'local_to_brevo' | 'bidirectional';
  operationType: 'full_sync' | 'incremental_sync' | 'manual_sync';
  forceUpdate?: boolean;
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

    const { direction = 'bidirectional', operationType = 'manual_sync', forceUpdate = false }: SyncOptions = await req.json()

    // Start sync log
    const { data: syncLog, error: logError } = await supabaseClient
      .from('newsletter_sync_log')
      .insert({
        operation_type: operationType,
        direction: direction,
        status: 'running'
      })
      .select()
      .single()

    if (logError) throw logError

    const syncLogId = syncLog.id
    let recordsProcessed = 0
    let recordsSucceeded = 0
    let recordsFailed = 0
    const errors: any[] = []

    try {
      const brevoApiKey = Deno.env.get('BREVO_API_KEY')
      if (!brevoApiKey) {
        throw new Error('Brevo API key not configured')
      }

      // Get MusicGift list ID
      const listsResponse = await fetch('https://api.brevo.com/v3/contacts/lists', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'api-key': brevoApiKey
        }
      })

      if (!listsResponse.ok) {
        throw new Error(`Failed to fetch Brevo lists: ${listsResponse.statusText}`)
      }

      const listsData = await listsResponse.json()
      const musicGiftList = listsData.lists?.find((list: any) => list.name === 'MusicGift')
      const listId = musicGiftList?.id || 1

      console.log(`Using Brevo list ID: ${listId}`)

      if (direction === 'brevo_to_local' || direction === 'bidirectional') {
        // Sync from Brevo to Local
        console.log('Starting Brevo → Local sync...')
        
        let offset = 0
        const limit = 500
        let hasMore = true

        while (hasMore) {
          const contactsResponse = await fetch(`https://api.brevo.com/v3/contacts?limit=${limit}&offset=${offset}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'api-key': brevoApiKey
            }
          })

          if (!contactsResponse.ok) {
            throw new Error(`Failed to fetch Brevo contacts: ${contactsResponse.statusText}`)
          }

          const contactsData = await contactsResponse.json()
          const contacts: BrevoContact[] = contactsData.contacts || []

          if (contacts.length === 0) {
            hasMore = false
            break
          }

          for (const contact of contacts) {
            recordsProcessed++

            try {
              // Check if contact exists locally
              const { data: existingContact } = await supabaseClient
                .from('newsletter_subscribers')
                .select('*')
                .eq('email', contact.email)
                .single()

              const contactData = {
                email: contact.email,
                name: contact.attributes.FIRSTNAME || null,
                brevo_contact_id: contact.id.toString(),
                is_active: !contact.emailBlacklisted,
                source: existingContact?.source || 'brevo',
                brevo_updated_at: contact.modifiedAt,
                brevo_list_ids: contact.listIds,
                last_brevo_sync: new Date().toISOString(),
                sync_status: 'synced'
              }

              if (existingContact) {
                // Update existing contact
                const shouldUpdate = forceUpdate || 
                  !existingContact.last_brevo_sync || 
                  new Date(contact.modifiedAt) > new Date(existingContact.brevo_updated_at || 0)

                if (shouldUpdate) {
                  const { error: updateError } = await supabaseClient
                    .from('newsletter_subscribers')
                    .update(contactData)
                    .eq('id', existingContact.id)

                  if (updateError) throw updateError
                }
              } else {
                // Insert new contact
                const { error: insertError } = await supabaseClient
                  .from('newsletter_subscribers')
                  .insert(contactData)

                if (insertError) throw insertError
              }

              recordsSucceeded++
            } catch (error) {
              recordsFailed++
              errors.push({ email: contact.email, error: error.message })
              console.error(`Failed to sync contact ${contact.email}:`, error)
            }
          }

          offset += limit
          if (contacts.length < limit) {
            hasMore = false
          }
        }
      }

      if (direction === 'local_to_brevo' || direction === 'bidirectional') {
        // Sync from Local to Brevo
        console.log('Starting Local → Brevo sync...')
        
        const { data: localContacts, error: fetchError } = await supabaseClient
          .from('newsletter_subscribers')
          .select('*')
          .order('updated_at', { ascending: true })

        if (fetchError) throw fetchError

        for (const contact of localContacts || []) {
          recordsProcessed++

          try {
            const brevoContactData = {
              email: contact.email,
              attributes: {
                FIRSTNAME: contact.name || '',
                SOURCE: contact.source
              },
              listIds: [listId],
              updateEnabled: true
            }

            if (contact.brevo_contact_id) {
              // Update existing Brevo contact
              const updateResponse = await fetch(`https://api.brevo.com/v3/contacts/${contact.brevo_contact_id}`, {
                method: 'PUT',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'api-key': brevoApiKey
                },
                body: JSON.stringify({
                  attributes: brevoContactData.attributes,
                  listIds: brevoContactData.listIds,
                  emailBlacklisted: !contact.is_active
                })
              })

              if (!updateResponse.ok) {
                const errorText = await updateResponse.text()
                throw new Error(`Failed to update Brevo contact: ${errorText}`)
              }
            } else {
              // Create new Brevo contact
              const createResponse = await fetch('https://api.brevo.com/v3/contacts', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'api-key': brevoApiKey
                },
                body: JSON.stringify(brevoContactData)
              })

              if (createResponse.ok) {
                const createdContact = await createResponse.json()
                
                // Update local contact with Brevo ID
                await supabaseClient
                  .from('newsletter_subscribers')
                  .update({ 
                    brevo_contact_id: createdContact.id?.toString(),
                    last_brevo_sync: new Date().toISOString(),
                    sync_status: 'synced'
                  })
                  .eq('id', contact.id)
              } else {
                const errorText = await createResponse.text()
                throw new Error(`Failed to create Brevo contact: ${errorText}`)
              }
            }

            recordsSucceeded++
          } catch (error) {
            recordsFailed++
            errors.push({ email: contact.email, error: error.message })
            console.error(`Failed to sync contact to Brevo ${contact.email}:`, error)
          }
        }
      }

      // Update sync log with completion
      await supabaseClient
        .from('newsletter_sync_log')
        .update({
          status: errors.length === 0 ? 'completed' : 'partial',
          records_processed: recordsProcessed,
          records_succeeded: recordsSucceeded,
          records_failed: recordsFailed,
          error_details: errors.length > 0 ? errors : null,
          completed_at: new Date().toISOString()
        })
        .eq('id', syncLogId)

      console.log(`Sync completed: ${recordsSucceeded}/${recordsProcessed} records synced successfully`)

      return new Response(
        JSON.stringify({
          success: true,
          syncLogId,
          recordsProcessed,
          recordsSucceeded,
          recordsFailed,
          errors: errors.length > 0 ? errors : null
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )

    } catch (error) {
      // Update sync log with failure
      await supabaseClient
        .from('newsletter_sync_log')
        .update({
          status: 'failed',
          records_processed: recordsProcessed,
          records_succeeded: recordsSucceeded,
          records_failed: recordsFailed,
          error_details: [{ error: error.message }],
          completed_at: new Date().toISOString()
        })
        .eq('id', syncLogId)

      throw error
    }

  } catch (error) {
    console.error('Brevo sync error:', error)
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
