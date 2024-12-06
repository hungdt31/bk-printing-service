-- This is an empty migration.
-- CreateTrigger
CREATE OR REPLACE FUNCTION update_print_order_reports()
RETURNS TRIGGER AS $$
DECLARE
   monthly_report_id INT;
   yearly_report_id INT;
BEGIN
   -- Chỉ xử lý khi status là SUCCESS
   IF NEW.status = 'SUCCESS' THEN
       -- Tìm hoặc tạo monthly report
       SELECT report_id INTO monthly_report_id
       FROM "Report"
       WHERE type = 'MONTHLY' 
       AND month = EXTRACT(MONTH FROM NEW.time_start)
       AND year = EXTRACT(YEAR FROM NEW.time_start);
        IF monthly_report_id IS NULL THEN
           INSERT INTO "Report" (type, month, year)
           VALUES ('MONTHLY', 
                   EXTRACT(MONTH FROM NEW.time_start)::INTEGER, 
                   EXTRACT(YEAR FROM NEW.time_start)::INTEGER)
           RETURNING report_id INTO monthly_report_id;
       END IF;
        -- Kiểm tra và thêm vào PrintOrderReport cho monthly
       IF NOT EXISTS (
           SELECT 1 FROM "print_order_reports"
           WHERE print_id = NEW.print_id AND report_id = monthly_report_id
       ) THEN
           INSERT INTO "print_order_reports" (print_id, report_id)
           VALUES (NEW.print_id, monthly_report_id);
       END IF;
        -- Tìm hoặc tạo yearly report
       SELECT report_id INTO yearly_report_id
       FROM "Report"
       WHERE type = 'YEARLY' 
       AND year = EXTRACT(YEAR FROM NEW.time_start);
        IF yearly_report_id IS NULL THEN
           INSERT INTO "Report" (type, year)
           VALUES ('YEARLY', 
                   EXTRACT(YEAR FROM NEW.time_start)::INTEGER)
           RETURNING report_id INTO yearly_report_id;
       END IF;
        -- Kiểm tra và thêm vào PrintOrderReport cho yearly
       IF NOT EXISTS (
           SELECT 1 FROM "print_order_reports"
           WHERE print_id = NEW.print_id AND report_id = yearly_report_id
       ) THEN
           INSERT INTO "print_order_reports" (print_id, report_id)
           VALUES (NEW.print_id, yearly_report_id);
       END IF;
   END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Tạo trigger
DROP TRIGGER IF EXISTS print_order_report_trigger ON "PrintOrder";
CREATE TRIGGER print_order_report_trigger
   AFTER UPDATE OF status ON "PrintOrder"
   FOR EACH ROW
   WHEN (NEW.status = 'SUCCESS')
   EXECUTE FUNCTION update_print_order_reports();