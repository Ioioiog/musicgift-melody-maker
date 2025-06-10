
-- Create table to track discount code email deliveries
CREATE TABLE public.discount_email_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discount_code_id UUID REFERENCES public.discount_codes(id),
  discount_code TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  email_type TEXT NOT NULL CHECK (email_type IN ('manual', 'auto_generated')),
  delivery_status TEXT NOT NULL DEFAULT 'sent' CHECK (delivery_status IN ('sent', 'delivered', 'bounced', 'failed')),
  brevo_message_id TEXT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.discount_email_deliveries ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all deliveries
CREATE POLICY "Admins can view all discount email deliveries" 
  ON public.discount_email_deliveries 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Create policy for admins to insert delivery records
CREATE POLICY "System can insert discount email deliveries" 
  ON public.discount_email_deliveries 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for admins to update delivery status
CREATE POLICY "Admins can update discount email deliveries" 
  ON public.discount_email_deliveries 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_discount_email_deliveries_code ON public.discount_email_deliveries(discount_code);
CREATE INDEX idx_discount_email_deliveries_email ON public.discount_email_deliveries(recipient_email);
CREATE INDEX idx_discount_email_deliveries_sent_at ON public.discount_email_deliveries(sent_at);
CREATE INDEX idx_discount_email_deliveries_type ON public.discount_email_deliveries(email_type);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_discount_email_deliveries_updated_at
  BEFORE UPDATE ON public.discount_email_deliveries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
