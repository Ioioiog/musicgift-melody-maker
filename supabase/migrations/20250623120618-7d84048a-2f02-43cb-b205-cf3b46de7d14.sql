
-- Drop the existing trigger to recreate it with better logic
DROP TRIGGER IF EXISTS trigger_update_discount_usage ON public.orders;

-- Update the function to handle both INSERT and UPDATE cases
CREATE OR REPLACE FUNCTION public.update_discount_usage()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT case (new orders created with completed status)
  IF TG_OP = 'INSERT' THEN
    IF NEW.payment_status = 'completed' AND NEW.discount_code IS NOT NULL THEN
      UPDATE public.discount_codes 
      SET used_count = used_count + 1,
          updated_at = now()
      WHERE code = NEW.discount_code;
    END IF;
    RETURN NEW;
  END IF;
  
  -- Handle UPDATE case (payment status changes to completed)
  IF TG_OP = 'UPDATE' THEN
    IF NEW.payment_status = 'completed' 
       AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed')
       AND NEW.discount_code IS NOT NULL THEN
      
      UPDATE public.discount_codes 
      SET used_count = used_count + 1,
          updated_at = now()
      WHERE code = NEW.discount_code;
    END IF;
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create INSERT trigger for new orders
CREATE TRIGGER trigger_update_discount_usage_insert
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_discount_usage();

-- Create UPDATE trigger for payment status changes
CREATE TRIGGER trigger_update_discount_usage_update
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_discount_usage();

-- Fix the existing order that used discount code 'DISC60X8RK' but didn't update the usage count
UPDATE public.discount_codes 
SET used_count = used_count + 1,
    updated_at = now()
WHERE code = 'DISC60X8RK' 
  AND used_count = 0;
