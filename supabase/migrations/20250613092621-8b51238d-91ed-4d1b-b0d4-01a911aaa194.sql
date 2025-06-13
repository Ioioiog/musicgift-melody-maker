
-- Update the email account configuration to use port 465 with SSL
UPDATE public.email_accounts 
SET 
  smtp_port = 465,
  smtp_security = 'SSL'
WHERE email_address = 'info@musicgift.ro';

-- If the account doesn't exist, create it (this will be handled by the application)
-- but we ensure the default values are correct for new accounts
ALTER TABLE public.email_accounts 
ALTER COLUMN smtp_port SET DEFAULT 465;

ALTER TABLE public.email_accounts 
ALTER COLUMN smtp_security SET DEFAULT 'SSL';
