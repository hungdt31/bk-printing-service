import express from "express";
import { BaseController } from "./abstractions/base-controller";
import { prisma } from "../providers/prisma.client";
import { StatusCodes } from "http-status-codes";
import expressAsyncHandler from "express-async-handler";
import RequestValidator from "../middlewares/request-validator";
import { PrinterSchema, UpdatePrinterSchema } from "../schemas/printer.schema";
import { validateResourceId } from "../middlewares/id.middleware";

export default class PrintersController extends BaseController {
  public path = "/printers";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(
      this.path,
      this.getAll,
    );
    this.router.post(
      this.path,
      [new RequestValidator(PrinterSchema).validate()],
      this.createNewPrinter,
    );
    this.router.delete(
      `${this.path}/:id`,
      [validateResourceId],
      this.deletePrinter,
    );
    this.router.put(
      `${this.path}/:id`,
      [validateResourceId, new RequestValidator(UpdatePrinterSchema).validate()],
      this.updatePrinter,
    );
  }

  getAll = expressAsyncHandler(
    async (
      request: express.Request,
      response: express.Response,
      next: express.NextFunction,
    ) => {
      const printers = await prisma.printer.findMany();
      response.status(StatusCodes.OK).json({
        data: printers,
        message: "Get all printers successfully!",
      });
    },
  );

  createNewPrinter = expressAsyncHandler(
    async (
      request: express.Request,
      response: express.Response,
      next: express.NextFunction,
    ) => {
      const newPrinter = await prisma.printer.create({
        data: request.body,
      });
      response.status(StatusCodes.CREATED).json({
        data: newPrinter,
        message: "Create new printer successfully!",
      });
    },
  );

  deletePrinter = expressAsyncHandler(
    async (
      request: express.Request,
      response: express.Response,
      next: express.NextFunction,
    ) => {
      const printerId = Number(request.params.id);
      await prisma.printer.delete({
        where: {
          printer_id: printerId,
        },
      });
      response.status(StatusCodes.OK).json({
        message: "Delete printer successfully!",
      });
    },
  );

  updatePrinter = expressAsyncHandler(
    async (
      request: express.Request,
      response: express.Response,
      next: express.NextFunction,
    ) => {
      const printerId = Number(request.params.id);
      const printer = await prisma.printer.findFirst({
        where: {
          printer_id: printerId,
        },
      });
      if (!printer) {
        response.status(StatusCodes.NOT_FOUND).json({
          message: "Printer not found!",
        });
        return;
      }
      const updatedPrinter = await prisma.printer.update({
        where: {
          printer_id: printerId,
        },
        data: request.body,
      });
      response.status(StatusCodes.OK).json({
        data: updatedPrinter,
        message: "Update printer successfully!",
      });
    },
  );
}
