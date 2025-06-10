
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { orderId, fileData } = await req.json()

    if (!orderId || !fileData) {
      return new Response(
        JSON.stringify({ error: 'Order ID and file data are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the order to verify it exists
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('id, user_id')
      .eq('id', orderId)
      .single()

    if (orderError || !orderData) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const fileInserts = []

    // Process file data from the form_data
    for (const addon in fileData) {
      const files = fileData[addon]
      
      if (Array.isArray(files)) {
        // Handle multiple files (e.g., from file uploads)
        for (const file of files) {
          if (file && file.url) {
            fileInserts.push({
              order_id: orderId,
              addon_key: addon,
              field_name: addon,
              file_url: file.url,
              file_name: file.fileName,
              file_type: file.fileType,
              file_size: file.fileSize,
              uploaded_by: orderData.user_id
            })
          }
        }
      } else if (files && files.url) {
        // Handle single file object (e.g., from audio recorder)
        fileInserts.push({
          order_id: orderId,
          addon_key: addon,
          field_name: addon,
          file_url: files.url,
          file_name: files.fileName,
          file_type: files.fileType,
          file_size: files.fileSize,
          uploaded_by: orderData.user_id
        })
      }
    }

    // Save file metadata in the order_attachments table
    if (fileInserts.length > 0) {
      const { error: insertError } = await supabase
        .from('order_attachments')
        .insert(fileInserts)

      if (insertError) {
        console.error('Error saving file metadata:', insertError)
        return new Response(
          JSON.stringify({ error: 'Failed to save file metadata' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Associated ${fileInserts.length} files with order ${orderId}`,
        fileCount: fileInserts.length
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
