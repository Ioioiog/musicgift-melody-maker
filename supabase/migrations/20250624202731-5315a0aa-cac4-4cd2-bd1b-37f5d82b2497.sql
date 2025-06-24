
-- Add template support fields to campaigns table
ALTER TABLE public.campaigns 
ADD COLUMN template_id text,
ADD COLUMN template_variables jsonb DEFAULT '{}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.campaigns.template_id IS 'Brevo template ID if campaign was created from a template';
COMMENT ON COLUMN public.campaigns.template_variables IS 'Template variables and customizations for Brevo template';
