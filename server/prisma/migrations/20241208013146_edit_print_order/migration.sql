-- DropForeignKey
ALTER TABLE "PrintOrder" DROP CONSTRAINT "PrintOrder_printer_id_fkey";

-- DropForeignKey
ALTER TABLE "PrintOrder" DROP CONSTRAINT "PrintOrder_user_id_fkey";

-- AddForeignKey
ALTER TABLE "PrintOrder" ADD CONSTRAINT "PrintOrder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintOrder" ADD CONSTRAINT "PrintOrder_printer_id_fkey" FOREIGN KEY ("printer_id") REFERENCES "Printer"("printer_id") ON DELETE CASCADE ON UPDATE CASCADE;
