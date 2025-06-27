
-- Drop the problematic RLS policy that tries to access auth.users table
DROP POLICY IF EXISTS "Users can view gift redemptions" ON public.gift_redemptions;

-- Create a simpler, secure RLS policy that only relies on gift_cards relationships
CREATE POLICY "Users can view gift redemptions for their gift cards" 
  ON public.gift_redemptions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.gift_cards 
      WHERE id = gift_redemptions.gift_card_id 
      AND sender_user_id = auth.uid()
    )
  );

-- Ensure users can create redemptions (business logic will handle validation)
CREATE POLICY "Authenticated users can create gift redemptions" 
  ON public.gift_redemptions 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);
