
-- Remove all existing policies on gift_card_designs table first
DROP POLICY IF EXISTS "Allow authenticated users to delete gift card designs" ON public.gift_card_designs;
DROP POLICY IF EXISTS "Allow authenticated users to insert gift card designs" ON public.gift_card_designs;
DROP POLICY IF EXISTS "Allow authenticated users to update gift card designs" ON public.gift_card_designs;
DROP POLICY IF EXISTS "Admins can view all gift card designs" ON public.gift_card_designs;
DROP POLICY IF EXISTS "Admins can insert gift card designs" ON public.gift_card_designs;
DROP POLICY IF EXISTS "Admins can update gift card designs" ON public.gift_card_designs;
DROP POLICY IF EXISTS "Admins can delete gift card designs" ON public.gift_card_designs;

-- Now create clean admin-only policies for gift card designs
CREATE POLICY "Admins can view all gift card designs" 
ON public.gift_card_designs 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can insert gift card designs" 
ON public.gift_card_designs 
FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can update gift card designs" 
ON public.gift_card_designs 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can delete gift card designs" 
ON public.gift_card_designs 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);
