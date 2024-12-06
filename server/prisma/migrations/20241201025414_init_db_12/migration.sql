/*
  Warnings:

  - You are about to drop the column `total_pages` on the `Report` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANKING', 'MOMO', 'ZALOPAY');

-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "method" "PaymentMethod" NOT NULL DEFAULT 'BANKING';

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "total_pages";
