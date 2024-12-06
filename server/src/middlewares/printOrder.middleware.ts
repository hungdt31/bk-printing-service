import express from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../providers/prisma.client";
import { PrintOrderSchema } from "../schemas/printOrder.schema";

export const printOrderExamination = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const validateBody = PrintOrderSchema.parse(req.body);
  const existDocument = await prisma.document.findUnique({
    where: {
      document_id: validateBody.document_id,
    },
  });
  const existPrinter = await prisma.printer.findUnique({
    where: {
      printer_id: validateBody.printer_id,
    },
  });
  if (!existDocument || !existPrinter) {
    return next(
      createHttpError(
        StatusCodes.BAD_REQUEST,
        "Document or printer not found!",
      ),
    );
  }
  // check document is belong to user
  if (existDocument.user_id !== req.jwtDecoded?.id) {
    return next(
      createHttpError(
        StatusCodes.BAD_REQUEST,
        "Document is not belong to user!",
      ),
    );
  }
  // find max value of validateBody.pages_to_be_printed
  const maxPage = Math.max(...validateBody.pages_to_be_printed);
  if (
    existDocument.page_count !== "unknown" &&
    maxPage > Number(existDocument.page_count)
  ) {
    return next(
      createHttpError(
        StatusCodes.BAD_REQUEST,
        "Page number is greater than the number of pages in the document!",
      ),
    );
  }
  next();
  return;
};
