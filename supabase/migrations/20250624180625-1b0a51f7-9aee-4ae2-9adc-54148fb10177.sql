
-- Enhance newsletter_subscribers table for bidirectional sync
ALTER TABLE public.newsletter_subscribers 
ADD COLUMN IF NOT EXISTS last_brevo_sync timestamp with time zone,
ADD COLUMN IF NOT EXISTS sync_status text DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending_sync', 'sync_failed')),
ADD COLUMN IF NOT EXISTS brevo_updated_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS brevo_list_ids jsonb DEFAULT '[]'::jsonb;

-- Create sync operations log table
CREATE TABLE IF NOT EXISTS public.newsletter_sync_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_type text NOT NULL, -- 'full_sync', 'incremental_sync', 'webhook_update', 'manual_sync'
  direction text NOT NULL CHECK (direction IN ('local_to_brevo', 'brevo_to_local', 'bidirectional')),
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'partial')),
  records_processed integer DEFAULT 0,
  records_succeeded integer DEFAULT 0,
  records_failed integer DEFAULT 0,
  error_details jsonb,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create contact sync conflicts table
CREATE TABLE IF NOT EXISTS public.newsletter_sync_conflicts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  conflict_type text NOT NULL, -- 'data_mismatch', 'status_conflict', 'duplicate_contact'
  local_data jsonb,
  brevo_data jsonb,
  resolution_strategy text, -- 'use_local', 'use_brevo', 'manual_review', 'merged'
  resolved boolean DEFAULT false,
  resolved_at timestamp with time zone,
  resolved_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_brevo_contact_id ON public.newsletter_subscribers(brevo_contact_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_sync_status ON public.newsletter_subscribers(sync_status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_last_brevo_sync ON public.newsletter_subscribers(last_brevo_sync);
CREATE INDEX IF NOT EXISTS idx_newsletter_sync_log_operation_type ON public.newsletter_sync_log(operation_type);
CREATE INDEX IF NOT EXISTS idx_newsletter_sync_log_status ON public.newsletter_sync_log(status);
