
-- Add SmartBill proforma tracking fields to gift_cards table
ALTER TABLE public.gift_cards 
ADD COLUMN IF NOT EXISTS smartbill_proforma_id TEXT,
ADD COLUMN IF NOT EXISTS smartbill_proforma_status TEXT DEFAULT 'pending';

-- Add payment tracking fields for better integration
ALTER TABLE public.gift_cards 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS netopia_order_id TEXT;

-- Create index for better performance on proforma lookups
CREATE INDEX IF NOT EXISTS idx_gift_cards_smartbill_proforma_id ON public.gift_cards(smartbill_proforma_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_stripe_session_id ON public.gift_cards(stripe_session_id);
