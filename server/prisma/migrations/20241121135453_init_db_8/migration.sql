/*
  Warnings:

  - You are about to drop the column `report_id` on the `PrintOrder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PrintOrder" DROP CONSTRAINT "PrintOrder_report_id_fkey";

-- AlterTable
ALTER TABLE "PrintOrder" DROP COLUMN "report_id";

-- CreateTable
CREATE TABLE "print_order_reports" (
    "print_id" INTEGER NOT NULL,
    "report_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "print_order_reports_pkey" PRIMARY KEY ("print_id","report_id")
);

-- AddForeignKey
ALTER TABLE "print_order_reports" ADD CONSTRAINT "print_order_reports_print_id_fkey" FOREIGN KEY ("print_id") REFERENCES "PrintOrder"("print_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "print_order_reports" ADD CONSTRAINT "print_order_reports_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("report_id") ON DELETE RESTRICT ON UPDATE CASCADE;
