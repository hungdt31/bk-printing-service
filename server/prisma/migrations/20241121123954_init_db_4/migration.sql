/*
  Warnings:

  - The `pages_to_be_printed` column on the `PrintOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PrintOrder" DROP COLUMN "pages_to_be_printed",
ADD COLUMN     "pages_to_be_printed" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
