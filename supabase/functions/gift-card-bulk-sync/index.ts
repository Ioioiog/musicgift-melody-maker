
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting bulk gift card SmartBill sync...');

    // Get all pending gift cards with SmartBill proforma IDs
    const { data: pendingGiftCards, error: fetchError } = await supabase
      .from('gift_cards')
      .select('id, code, smartbill_proforma_id, payment_status')
      .eq('payment_status', 'pending')
      .not('smartbill_proforma_id', 'is', null);

    if (fetchError) {
      console.error('Error fetching pending gift cards:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch pending gift cards' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!pendingGiftCards || pendingGiftCards.length === 0) {
      console.log('No pending gift cards found for sync');
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'No pending gift cards found for sync',
          processedCount: 0
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${pendingGiftCards.length} pending gift cards to sync`);

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // Process each gift card
    for (const giftCard of pendingGiftCards) {
      try {
        console.log(`Syncing gift card ${giftCard.code} (${giftCard.id})`);
        
        // Call the individual sync function
        const { data: syncResult, error: syncError } = await supabase.functions.invoke('gift-card-smartbill-sync', {
          body: { giftCardId: giftCard.id }
        });

        if (syncError) {
          console.error(`Error syncing gift card ${giftCard.code}:`, syncError);
          errorCount++;
          results.push({
            giftCardId: giftCard.id,
            code: giftCard.code,
            success: false,
            error: syncError.message || 'Unknown error'
          });
        } else {
          console.log(`Successfully processed gift card ${giftCard.code}`);
          successCount++;
          results.push({
            giftCardId: giftCard.id,
            code: giftCard.code,
            success: true,
            ...syncResult
          });
        }

        // Add a small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Exception syncing gift card ${giftCard.code}:`, error);
        errorCount++;
        results.push({
          giftCardId: giftCard.id,
          code: giftCard.code,
          success: false,
          error: error.message || 'Unknown exception'
        });
      }
    }

    console.log(`Bulk sync completed - Success: ${successCount}, Errors: ${errorCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Bulk sync completed - ${successCount} successful, ${errorCount} errors`,
        totalProcessed: pendingGiftCards.length,
        successCount,
        errorCount,
        results
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in bulk gift card sync:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
