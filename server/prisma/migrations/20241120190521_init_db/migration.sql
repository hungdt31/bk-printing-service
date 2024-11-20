-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'LECTURER', 'SPSO');

-- CreateEnum
CREATE TYPE "Campus" AS ENUM ('ONE', 'TWO');

-- CreateEnum
CREATE TYPE "Building" AS ENUM ('H1', 'H2', 'H3', 'H6', 'Gymnasium');

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
CREATE TYPE "PurchaseStatus" AS ENUM ('UNPAID', 'PAID', 'CANCELED');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(32),
    "password" VARCHAR(128) NOT NULL,
    "email" VARCHAR(32) NOT NULL,
    "phone" VARCHAR(16),
    "dob" TIMESTAMP(3),
    "balance" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Printer" (
    "printer_id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "brand" VARCHAR(256) NOT NULL,
    "model" VARCHAR(256) NOT NULL,
    "description" VARCHAR(4096) NOT NULL,
    "loc_campus" "Campus" NOT NULL DEFAULT 'ONE',
    "loc_building" "Building" NOT NULL DEFAULT 'H1',
    "loc_room" VARCHAR(64) NOT NULL,
    "status" "PrinterStatus" NOT NULL DEFAULT 'RUNNING',

    CONSTRAINT "Printer_pkey" PRIMARY KEY ("printer_id")
);

-- CreateTable
CREATE TABLE "PrintOrder" (
    "print_id" SERIAL NOT NULL,
    "side" "Side" NOT NULL DEFAULT 'ONE',
    "page_size" "PageSize" NOT NULL DEFAULT 'A4',
    "orientation" "Orientation" NOT NULL DEFAULT 'PORTRAIT',
    "pages_per_sheet" INTEGER NOT NULL DEFAULT 1,
    "scale" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "time_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_end" TIMESTAMP(3),
    "status" "PrintStatus" NOT NULL DEFAULT 'PENDING',
    "pages_to_be_printed" VARCHAR(64),
    "num_pages_printed" INTEGER,
    "document_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "printer_id" INTEGER NOT NULL,
    "report_id" INTEGER,

    CONSTRAINT "PrintOrder_pkey" PRIMARY KEY ("print_id")
);

-- CreateTable
CREATE TABLE "Document" (
    "document_id" SERIAL NOT NULL,
    "filename" VARCHAR(64) NOT NULL,
    "mimetype" VARCHAR(64) NOT NULL,
    "page_count" TEXT NOT NULL DEFAULT 'unknown',
    "size" INTEGER NOT NULL DEFAULT 0,
    "url" VARCHAR(256) NOT NULL,
    "path" VARCHAR(256) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("document_id")
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

-- CreateTable
CREATE TABLE "Report" (
    "report_id" SERIAL NOT NULL,
    "type" "ReportType" NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "total_pages" INTEGER NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("report_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Printer_name_key" ON "Printer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PrintOrder_print_id_key" ON "PrintOrder"("print_id");

-- CreateIndex
CREATE UNIQUE INDEX "Document_path_key" ON "Document"("path");

-- AddForeignKey
ALTER TABLE "PrintOrder" ADD CONSTRAINT "PrintOrder_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Document"("document_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintOrder" ADD CONSTRAINT "PrintOrder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintOrder" ADD CONSTRAINT "PrintOrder_printer_id_fkey" FOREIGN KEY ("printer_id") REFERENCES "Printer"("printer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrintOrder" ADD CONSTRAINT "PrintOrder_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("report_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
