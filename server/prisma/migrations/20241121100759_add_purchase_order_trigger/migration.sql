-- This is an empty migration.-- CreateFunction
CREATE OR REPLACE FUNCTION update_user_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Kiểm tra nếu status được cập nhật thành PAID và user_id không null
    IF (TG_OP = 'UPDATE' AND NEW.status = 'PAID' AND OLD.status != 'PAID' AND NEW.user_id IS NOT NULL) THEN
        -- Cập nhật balance của user với kiểm tra null
        UPDATE "User"
        SET balance = COALESCE(balance, 0) + COALESCE(NEW.amount, 0)
        WHERE user_id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- DropTrigger (nếu đã tồn tại)
DROP TRIGGER IF EXISTS update_user_balance_trigger ON "PurchaseOrder";

-- CreateTrigger
CREATE TRIGGER update_user_balance_trigger
    AFTER UPDATE ON "PurchaseOrder"
    FOR EACH ROW
    EXECUTE FUNCTION update_user_balance();