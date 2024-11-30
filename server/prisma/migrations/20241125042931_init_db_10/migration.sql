/*
  Warnings:

  - You are about to drop the column `num_pages_printed` on the `PrintOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PrintOrder" DROP COLUMN "num_pages_printed",
ADD COLUMN     "num_pages_consumed" INTEGER;
