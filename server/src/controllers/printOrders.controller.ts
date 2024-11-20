import express from "express";
import { BaseController } from "./abstractions/base-controller";
import { prisma } from "../providers/prisma.client";
import { StatusCodes } from "http-status-codes";
import expressAsyncHandler from "express-async-handler";
import RequestValidator from "../middlewares/request-validator";
import { PrintOrderSchema, UpdatePrintOrderSchema } from "../schemas/printOrder.schema";
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
      [new RequestValidator(PrintOrderSchema).validate()],
      this.order,
    );
    this.router.delete(
      `${this.path}/:id`,
      [validateResourceId],
      this.deletePrintOrder,
    );
    this.router.put(
      `${this.path}/:id`,
      [validateResourceId, new RequestValidator(UpdatePrintOrderSchema).validate()],
      this.updatePrintOrder,
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

  order = expressAsyncHandler(
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

  deletePrintOrder = expressAsyncHandler(
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

  updatePrintOrder = expressAsyncHandler(
    async (
      request: express.Request,
      response: express.Response,
      next: express.NextFunction,
    ) => {

    }
  );
}
