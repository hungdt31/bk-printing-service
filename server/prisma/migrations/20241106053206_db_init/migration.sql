-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('STUDENT', 'LECTURER');

-- CreateEnum
CREATE TYPE "Campus" AS ENUM ('ONE', 'TWO');

-- CreateEnum
CREATE TYPE "PrinterStatus" AS ENUM ('RUNNING', 'DISABLED', 'DELETED');

-- CreateEnum
CREATE TYPE "Side" AS ENUM ('ONE', 'TWO');

-- CreateEnum
CREATE TYPE "PageSize" AS ENUM ('A4', 'A3');

-- CreateEnum
CREATE TYPE "Orientation" AS ENUM ('PORTRAIT', 'LANDSCAPE');

-- CreateEnum
CREATE TYPE "PrintStatus" AS ENUM ('SUCCESS', 'PROGRESS', 'FAILED', 'PENDING');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('UNPAID', 'PAID');

-- CreateTable
CREATE TABLE "Customer" (
    "customer_id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "type" "UserType" NOT NULL DEFAULT 'STUDENT',
    "email" VARCHAR(32) NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "last_used" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "Spso" (
    "spso_id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "username" VARCHAR(32) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(32) NOT NULL,
    "phone" VARCHAR(16) NOT NULL,
    "last_used" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Spso_pkey" PRIMARY KEY ("spso_id")
);

-- CreateTable
CREATE TABLE "Printer" (
    "printer_id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "brand" VARCHAR(256) NOT NULL,
    "model" VARCHAR(256) NOT NULL,
    "description" VARCHAR(4096) NOT NULL,
    "loc_campus" "Campus" NOT NULL DEFAULT 'ONE',
    "loc_building" VARCHAR(64) NOT NULL,
    "loc_room" VARCHAR(64) NOT NULL,
    "status" "PrinterStatus" NOT NULL DEFAULT 'RUNNING',

    CONSTRAINT "Printer_pkey" PRIMARY KEY ("printer_id")
);

-- CreateTable
CREATE TABLE "Document" (
    "document_id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "file_type" VARCHAR(8) NOT NULL,
    "no_of_pages" INTEGER NOT NULL,
    "user_id" INTEGER,
    "printer_id" INTEGER,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "PrintOrder" (
    "print_id" SERIAL NOT NULL,
    "side" "Side" NOT NULL DEFAULT 'ONE',
    "page_size" "PageSize" NOT NULL DEFAULT 'A4',
    "orientation" "Orientation" NOT NULL DEFAULT 'PORTRAIT',
    "pages_per_sheet" INTEGER NOT NULL DEFAULT 1,
    "scale" DOUBLE PRECISION NOT NULL DEFAULT 1.00,
    "time_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_end" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "PrintStatus" NOT NULL DEFAULT 'PENDING',
    "pages_to_be_printed" VARCHAR(64),
    "num_pages_printed" INTEGER,
    "document_id" INTEGER,
    "user_id" INTEGER,

    CONSTRAINT "PrintOrder_pkey" PRIMARY KEY ("print_id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "purchase_id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'UNPAID',
    "user_id" INTEGER,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("purchase_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Spso_username_key" ON "Spso"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Printer_name_key" ON "Printer"("name");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_printer_id_fkey" FOREIGN KEY ("printer_id") REFERENCES "Printer"("printer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintOrder" ADD CONSTRAINT "PrintOrder_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Document"("document_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintOrder" ADD CONSTRAINT "PrintOrder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;
