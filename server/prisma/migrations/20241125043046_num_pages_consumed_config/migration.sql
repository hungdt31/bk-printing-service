-- CreateTrigger
CREATE OR REPLACE FUNCTION update_num_pages_consumed()
RETURNS TRIGGER AS $$
BEGIN
  NEW.num_pages_consumed := CASE 
    WHEN NEW.page_size = 'A3' THEN array_length(NEW.pages_to_be_printed, 1) * 2
    ELSE array_length(NEW.pages_to_be_printed, 1)
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS update_pages_consumed ON "PrintOrder";

-- Create trigger
CREATE TRIGGER update_pages_consumed
  BEFORE INSERT OR UPDATE OF pages_to_be_printed, page_size
  ON "PrintOrder"
  FOR EACH ROW
  EXECUTE FUNCTION update_num_pages_consumed();