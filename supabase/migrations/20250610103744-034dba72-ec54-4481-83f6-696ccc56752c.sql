
-- Add additional columns to track more detailed email delivery information
ALTER TABLE public.discount_email_deliveries 
ADD COLUMN opened_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN clicked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN bounce_reason TEXT,
ADD COLUMN engagement_score INTEGER DEFAULT 0;

-- Update the delivery_status check constraint to include new statuses
ALTER TABLE public.discount_email_deliveries 
DROP CONSTRAINT IF EXISTS discount_email_deliveries_delivery_status_check;

ALTER TABLE public.discount_email_deliveries 
ADD CONSTRAINT discount_email_deliveries_delivery_status_check 
CHECK (delivery_status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'hard_bounced', 'soft_bounced', 'failed', 'unsubscribed'));

-- Create index for better webhook processing performance
CREATE INDEX IF NOT EXISTS idx_discount_email_deliveries_brevo_id ON public.discount_email_deliveries(brevo_message_id);

-- Enable realtime updates for the table
ALTER TABLE public.discount_email_deliveries REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.discount_email_deliveries;
