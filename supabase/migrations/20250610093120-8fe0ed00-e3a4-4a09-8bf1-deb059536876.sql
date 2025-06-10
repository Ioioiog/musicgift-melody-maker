
-- Create a table for discount code auto-generation rules
CREATE TABLE public.discount_auto_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('order_completed', 'first_order', 'order_amount')),
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER NOT NULL,
  minimum_order_amount INTEGER DEFAULT 0,
  maximum_discount_amount INTEGER,
  validity_days INTEGER NOT NULL,
  code_prefix TEXT NOT NULL,
  limit_per_customer INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users
);

-- Add Row Level Security (RLS)
ALTER TABLE public.discount_auto_rules ENABLE ROW LEVEL SECURITY;

-- Create policy that allows authenticated users to view all rules
CREATE POLICY "Anyone can view auto-generation rules" 
  ON public.discount_auto_rules 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create policy that allows authenticated users to create rules
CREATE POLICY "Anyone can create auto-generation rules" 
  ON public.discount_auto_rules 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Create policy that allows authenticated users to update rules
CREATE POLICY "Anyone can update auto-generation rules" 
  ON public.discount_auto_rules 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Create policy that allows authenticated users to delete rules
CREATE POLICY "Anyone can delete auto-generation rules" 
  ON public.discount_auto_rules 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_discount_auto_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_discount_auto_rules_updated_at
  BEFORE UPDATE ON public.discount_auto_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_discount_auto_rules_updated_at();
