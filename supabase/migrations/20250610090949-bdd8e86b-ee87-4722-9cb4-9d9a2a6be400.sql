
-- Create discount codes table
CREATE TABLE public.discount_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER NOT NULL CHECK (discount_value > 0),
  minimum_order_amount INTEGER DEFAULT 0,
  maximum_discount_amount INTEGER DEFAULT NULL,
  usage_limit INTEGER DEFAULT NULL,
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- Policy for viewing discount codes (public can check validity)
CREATE POLICY "Anyone can view active discount codes for validation" 
  ON public.discount_codes 
  FOR SELECT 
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Policy for admins to manage discount codes
CREATE POLICY "Admins can manage discount codes" 
  ON public.discount_codes 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  ));

-- Create function to validate and apply discount code
CREATE OR REPLACE FUNCTION public.validate_discount_code(
  code_input TEXT,
  order_total INTEGER
) RETURNS TABLE (
  is_valid BOOLEAN,
  discount_amount INTEGER,
  discount_type TEXT,
  error_message TEXT
) LANGUAGE plpgsql AS $$
DECLARE
  discount_record RECORD;
  calculated_discount INTEGER;
BEGIN
  -- Find the discount code
  SELECT * INTO discount_record
  FROM public.discount_codes
  WHERE code = code_input
  AND is_active = true
  AND (expires_at IS NULL OR expires_at > now());

  -- Check if code exists and is valid
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, ''::TEXT, 'Invalid or expired discount code'::TEXT;
    RETURN;
  END IF;

  -- Check minimum order amount
  IF discount_record.minimum_order_amount > 0 AND order_total < discount_record.minimum_order_amount THEN
    RETURN QUERY SELECT false, 0, ''::TEXT, 
      format('Minimum order amount is %s', discount_record.minimum_order_amount)::TEXT;
    RETURN;
  END IF;

  -- Check usage limit
  IF discount_record.usage_limit IS NOT NULL AND discount_record.used_count >= discount_record.usage_limit THEN
    RETURN QUERY SELECT false, 0, ''::TEXT, 'Discount code usage limit reached'::TEXT;
    RETURN;
  END IF;

  -- Calculate discount amount
  IF discount_record.discount_type = 'percentage' THEN
    calculated_discount := (order_total * discount_record.discount_value) / 100;
  ELSE
    calculated_discount := discount_record.discount_value;
  END IF;

  -- Apply maximum discount limit if set
  IF discount_record.maximum_discount_amount IS NOT NULL THEN
    calculated_discount := LEAST(calculated_discount, discount_record.maximum_discount_amount);
  END IF;

  -- Ensure discount doesn't exceed order total
  calculated_discount := LEAST(calculated_discount, order_total);

  RETURN QUERY SELECT true, calculated_discount, discount_record.discount_type, ''::TEXT;
END;
$$;

-- Add discount tracking to orders table
ALTER TABLE public.orders 
ADD COLUMN discount_code TEXT DEFAULT NULL,
ADD COLUMN discount_amount INTEGER DEFAULT 0;

-- Create trigger to update discount code usage when order is completed
CREATE OR REPLACE FUNCTION public.update_discount_usage()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update when payment status changes to completed and discount was applied
  IF NEW.payment_status = 'completed' 
     AND OLD.payment_status != 'completed' 
     AND NEW.discount_code IS NOT NULL THEN
    
    UPDATE public.discount_codes 
    SET used_count = used_count + 1,
        updated_at = now()
    WHERE code = NEW.discount_code;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_discount_usage
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_discount_usage();
