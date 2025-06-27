
-- Update the gift_cards status check constraint to include proper status values
ALTER TABLE public.gift_cards 
DROP CONSTRAINT IF EXISTS gift_cards_status_check;

ALTER TABLE public.gift_cards 
ADD CONSTRAINT gift_cards_status_check 
CHECK (status IN ('active', 'partially_redeemed', 'fully_redeemed', 'expired', 'cancelled'));

-- Add a constraint to prevent redemption amounts from exceeding gift card value
-- This will be enforced by business logic, but we'll add a helpful function
CREATE OR REPLACE FUNCTION validate_gift_card_redemption()
RETURNS TRIGGER AS $$
DECLARE
  current_balance INTEGER;
  gift_card_value INTEGER;
BEGIN
  -- Get current balance and original value
  SELECT 
    COALESCE(gc.gift_amount, gc.amount_eur, gc.amount_ron, 0) as original_value,
    COALESCE(gc.gift_amount, gc.amount_eur, gc.amount_ron, 0) - COALESCE(SUM(gr.redeemed_amount), 0) as remaining_balance
  INTO gift_card_value, current_balance
  FROM public.gift_cards gc
  LEFT JOIN public.gift_redemptions gr ON gc.id = gr.gift_card_id
  WHERE gc.id = NEW.gift_card_id
  GROUP BY gc.id, gc.gift_amount, gc.amount_eur, gc.amount_ron;

  -- Check if redemption amount exceeds available balance
  IF NEW.redeemed_amount > current_balance THEN
    RAISE EXCEPTION 'Redemption amount (%) exceeds available balance (%)', NEW.redeemed_amount, current_balance;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate redemptions
DROP TRIGGER IF EXISTS validate_redemption_trigger ON public.gift_redemptions;
CREATE TRIGGER validate_redemption_trigger
  BEFORE INSERT ON public.gift_redemptions
  FOR EACH ROW
  EXECUTE FUNCTION validate_gift_card_redemption();

-- Update existing 'used' status records to 'fully_redeemed' if any exist
UPDATE public.gift_cards 
SET status = 'fully_redeemed' 
WHERE status = 'used';
