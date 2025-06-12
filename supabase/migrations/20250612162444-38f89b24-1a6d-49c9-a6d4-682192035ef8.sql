
-- Create quote_requests table for better organization
CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  package_name TEXT NOT NULL,
  package_value TEXT NOT NULL,
  selected_addons TEXT[] DEFAULT '{}',
  addon_field_values JSONB DEFAULT '{}',
  form_data JSONB NOT NULL,
  estimated_price DECIMAL(10,2),
  currency TEXT NOT NULL DEFAULT 'RON',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'quoted', 'converted', 'declined')),
  admin_notes TEXT,
  quote_response TEXT,
  quoted_price DECIMAL(10,2),
  quote_valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users
);

-- Add RLS policies for quote requests
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own quote requests
CREATE POLICY "Users can view their own quote requests" 
  ON public.quote_requests 
  FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can create quote requests
CREATE POLICY "Users can create quote requests" 
  ON public.quote_requests 
  FOR INSERT 
  WITH CHECK (true);

-- Admins can view all quote requests
CREATE POLICY "Admins can view all quote requests" 
  ON public.quote_requests 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Add index for performance
CREATE INDEX idx_quote_requests_status ON public.quote_requests(status);
CREATE INDEX idx_quote_requests_created_at ON public.quote_requests(created_at DESC);
CREATE INDEX idx_quote_requests_user_id ON public.quote_requests(user_id);
