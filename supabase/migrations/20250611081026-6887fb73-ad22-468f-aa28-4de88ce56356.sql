
-- Remove all existing policies on gift_cards table
DROP POLICY IF EXISTS "Users can create gift cards" ON public.gift_cards;
DROP POLICY IF EXISTS "Users can view their created gift cards" ON public.gift_cards;
DROP POLICY IF EXISTS "Anyone can view gift cards by code" ON public.gift_cards;
DROP POLICY IF EXISTS "Users can view received gift cards" ON public.gift_cards;

-- Create a policy that allows users to insert gift cards with their user_id
CREATE POLICY "Users can create gift cards" 
  ON public.gift_cards 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_user_id OR sender_user_id IS NULL);

-- Create a simple policy that allows users to view gift cards they created
CREATE POLICY "Users can view their created gift cards" 
  ON public.gift_cards 
  FOR SELECT 
  USING (auth.uid() = sender_user_id);

-- Allow anyone to view gift cards by code (for redemption)
CREATE POLICY "Anyone can view gift cards by code" 
  ON public.gift_cards 
  FOR SELECT 
  USING (true);
