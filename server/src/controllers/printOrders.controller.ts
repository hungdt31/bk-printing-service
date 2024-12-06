import express from "express";
import { BaseController } from "./abstractions/base-controller";
import { prisma } from "../providers/prisma.client";
import { StatusCodes } from "http-status-codes";
import expressAsyncHandler from "express-async-handler";
import RequestValidator from "../middlewares/request-validator";
import {
  PrintOrderSchema,
  UpdatePrintOrderSchema,
  searchPrintOrder,
} from "../schemas/printOrder.schema";
import { validateResourceId } from "../middlewares/id.middleware";
import createHttpError from "http-errors";
import { printOrderExamination } from "../middlewares/printOrder.middleware";
import { z } from "zod";

export default class PrintOrdersController extends BaseController {
  public path = "/print-orders";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getListPrintOrders);
    this.router.get(`${this.path}/history`, this.getHistoryPrintOrders);
    this.router.get(
      `${this.path}/:id`,
      [validateResourceId],
      this.getPrintOrderById,
    );
    this.router.post(
      this.path,
      [
        new RequestValidator(PrintOrderSchema).validate(),
        printOrderExamination,
      ],
      this.order,
    );
    this.router.post(
      `${this.path}/history`,
      [
        new RequestValidator(searchPrintOrder).validate(),
      ],
      this.getAllPrintOrdersByTime,
    );
    this.router.put(
      `${this.path}/payment/:id`,
      [validateResourceId],
      this.processPayment,
    );
    this.router.put(`${this.path}/bulk-payment`, this.processMultiplePayments);
    this.router.patch(
      `${this.path}/:id`,
      [validateResourceId],
      this.cancelPrintOrder,
    );
  }

  getHistoryPrintOrders = expressAsyncHandler(
    async (
      request: express.Request,
      response: express.Response,
      next: express.NextFunction,
    ) => {
      const user = await prisma.user.findUnique({
        where: {
          user_id: request.jwtDecoded?.id as number,
        },
        include: {
          printOrders: {
            where: {
              status: {
                in: ["SUCCESS", "FAILED", "CANCELLED"],
              },
            },
            orderBy: {
              time_start: "desc",
            },
            include: {
              printer: {
                select: {
                  name: true,
                },
              },
              document: {
                select: {
                  filename: true,
                  page_count: true,
                  url: true,
                },
              },
            },
          },
        },
      });
      if (!user) {
        return next(createHttpError(StatusCodes.NOT_FOUND, "User not found!"));
      }
      response.status(StatusCodes.OK).json({
        data: user.printOrders,
        message: "Get history print orders successfully!",
      });
    },
  );

  getListPrintOrders = expressAsyncHandler(
    async (
      request: express.Request,
      response: express.Response,
      next: express.NextFunction,
    ) => {
      const user = await prisma.user.findUnique({
        where: {
          user_id: request.jwtDecoded?.id as number,
        },
        include: {
          printOrders: {
            where: {
              status: "PENDING",
            },
            include: {
              printer: {
                select: {
                  name: true,
                },
              },
              document: {
                select: {
                  filename: true,
                  page_count: true,
                  url: true,
                },
              },
            },
          },
        },
      });
      if (!user) {
        return next(createHttpError(StatusCodes.NOT_FOUND, "User not found!"));
      }
      response.status(StatusCodes.OK).json({
        data: user.printOrders,
        message: "Get list print orders successfully!",
      });
    },
  );

  getPrintOrderById = expressAsyncHandler(
    async (
      request: express.Request,
      response: express.Response,
      next: express.NextFunction,
    ) => {
      const { id } = request.params;
      const printOrders = await prisma.printOrder.findMany({
        where: {
          user_id: parseInt(id),
        },
      });
      if (!printOrders) {
        return next(
          createHttpError(StatusCodes.NOT_FOUND, "Print order not found!"),
        );
      }
      response.status(StatusCodes.OK).json({
        data: printOrders,
        message: "Get print order successfully!",
      });
    },
  );

  order = expressAsyncHandler(
    async (
      request: express.Request,
      response: express.Response,
      next: express.NextFunction,
    ) => {
      // create new print order
      const printOrderData = request.body;
      const newPrintOrder = await prisma.printOrder.create({
        data: {
          ...printOrderData,
          user_id: request.jwtDecoded?.id as number,
        },
      });
      // đưa vào giỏ hàng để thanh toán sau
      if (newPrintOrder.status === "PENDING") {
        response.status(StatusCodes.OK).json({
          data: newPrintOrder,
          message: "Create new print order successfully!",
        });
      }
      // in ngay và trừ balance
      else if (newPrintOrder.status === "PROGRESS") {
        const user = await prisma.user.findUnique({
          where: {
            user_id: newPrintOrder.user_id,
          },
        });
        if (!user) {
          return next(createHttpError(StatusCodes.NOT_FOUND, "User not found!"));
        }
        if (!newPrintOrder.num_pages_consumed) {
          return next(createHttpError(StatusCodes.BAD_REQUEST, "Print order is invalid!"));
        }
        // trường hợp balance không đủ
        if (newPrintOrder.num_pages_consumed > user.balance) {
          const updatedPrintOrder = await prisma.printOrder.update({
            where: {
              print_id: newPrintOrder.print_id,
            },
            data: {
              status: "FAILED",
              time_end: new Date(),
            },
          });
          response.status(StatusCodes.BAD_REQUEST).json({
            data: updatedPrintOrder,
            message: "Insufficient balance!",
          });
        }
        // trường hợp balance đủ
        else {
          // trừ balance của user
          await prisma.user.update({
            where: {
              user_id: newPrintOrder.user_id,
            },
            data: {
              balance: user.balance - newPrintOrder.num_pages_consumed,
            },
          });
          // cập nhật đơn hàng thành công
          const updatedPrintOrder = await prisma.printOrder.update({
            where: {
              print_id: newPrintOrder.print_id,
            },
            data: {
              status: "SUCCESS",
              time_end: new Date(),
            },
          });
          response.status(StatusCodes.OK).json({
            data: updatedPrintOrder,
            message: "Printing successfully!",
          });
        }
      }
    },
  );

  processPayment = expressAsyncHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ): Promise<void> => {
      const { id } = req.params;
      const userId = req.jwtDecoded?.id;
      // Kiểm tra print order tồn tại và thuộc về user
      const printOrder = await prisma.printOrder.findFirst({
        where: {
          print_id: Number(id),
          user_id: userId,
        },
        include: {
          user: true,
        },
      });

      if (!printOrder) {
        return next(
          createHttpError(StatusCodes.NOT_FOUND, "Print order not found"),
        );
      }

      if (!printOrder.num_pages_consumed) {
        return next(
          createHttpError(
            StatusCodes.BAD_REQUEST,
            "Invalid print order: missing number of pages",
          ),
        );
      }

      // Kiểm tra balance
      const requiredBalance = printOrder.num_pages_consumed;
      const currentBalance = printOrder.user?.balance || 0;

      if (requiredBalance > currentBalance) {
        const failedOrder = await prisma.printOrder.update({
          where: { print_id: Number(id) },
          data: {
            status: "FAILED",
            time_end: new Date(),
          },
        });

        res.status(StatusCodes.BAD_REQUEST).json({
          data: failedOrder,
          message: `Insufficient balance. Required: ${requiredBalance}, Current: ${currentBalance}`,
        });
      } else {
        // Trừ balance của user
        await prisma.user.update({
          where: { user_id: userId },
          data: {
            balance: {
              decrement: requiredBalance,
            },
          },
        });

        // Cập nhật trạng thái đơn hàng
        const updatedOrder = await prisma.printOrder.update({
          where: { print_id: Number(id) },
          data: {
            status: "SUCCESS",
            time_end: new Date(),
          },
        });
        res.status(StatusCodes.OK).json({
          data: updatedOrder,
          message: "Payment processed successfully",
        });
      }
    },
  );

  processMultiplePayments = expressAsyncHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ): Promise<void> => {
      const { printOrderIds } = req.body as { printOrderIds: number[] };
      const userId = req.jwtDecoded?.id;
      // Kiểm tra tất cả print orders tồn tại và thuộc về user
      const printOrders = await prisma.printOrder.findMany({
        where: {
          print_id: { in: printOrderIds },
          user_id: userId,
        },
        include: {
          user: true,
        },
      });

      if (printOrders.length !== printOrderIds.length) {
        return next(
          createHttpError(
            StatusCodes.NOT_FOUND,
            "Some print orders not found or don't belong to user",
          ),
        );
      }

      // Tính tổng số trang cần thiết
      const totalRequiredBalance = printOrders.reduce(
        (sum, order) => sum + (order.num_pages_consumed || 0),
        0,
      );

      const currentBalance = printOrders[0]?.user?.balance || 0;

      if (totalRequiredBalance > currentBalance) {
        // Cập nhật tất cả orders thành FAILED
        const failedOrders = await prisma.printOrder.updateMany({
          where: { print_id: { in: printOrderIds } },
          data: {
            status: "FAILED",
            time_end: new Date(),
          },
        });

        res.status(StatusCodes.BAD_REQUEST).json({
          data: failedOrders,
          message: `Insufficient balance. Required: ${totalRequiredBalance}, Current: ${currentBalance}`,
        });
        return;
      }

      // Xử lý thanh toán trong transaction
      await prisma.$transaction(async (tx) => {
        // 1. Trừ balance của user
        const updatedUser = await tx.user.update({
          where: { user_id: userId },
          data: {
            balance: {
              decrement: totalRequiredBalance,
            },
          },
        });

        // 2. Cập nhật trạng thái các đơn hàng
        const updatedOrders = await tx.printOrder.updateMany({
          where: { print_id: { in: printOrderIds } },
          data: {
            status: "SUCCESS",
            time_end: new Date(),
          },
        });

        res.status(StatusCodes.OK).json({
          data: {
            orders: updatedOrders,
            remainingBalance: updatedUser.balance,
          },
          message: "Multiple payments processed successfully",
        });
      });
    },
  );

  cancelPrintOrder = expressAsyncHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const { id } = req.params;
      const printOrder = await prisma.printOrder.findUnique({
        where: { print_id: Number(id) },
      });
      if (!printOrder) {
        return next(
          createHttpError(StatusCodes.NOT_FOUND, "Print order not found"),
        );
      }
      const deletedPrintOrder = await prisma.printOrder.update({
        where: { print_id: Number(id) },
        data: {
          status: "CANCELLED",
        },
      });
      res.status(StatusCodes.OK).json({
        data: deletedPrintOrder,
        message: "Print order canceled successfully",
      });
    },
  );

  getAllPrintOrdersByTime = expressAsyncHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const input = searchPrintOrder.safeParse(req.body);
      let printOrders = await prisma.printOrder.findMany({
        where: {
          time_start: {
            gte: input.data?.time_start,
            lte: input.data?.time_end,
          },
          status: input.data?.status,
          printer_id: input.data?.printer_id,
        },
        include: {
          user: {
            select: {
              user_id: true,
              username: true,
              email: true,
              avatar: {
                select: {
                  url: true
                }
              }
            }
          },
          document: {
            select: {
              filename: true,
              mimetype: true,
              size: true
            }
          }
        }
      });
      
      if (input.data && input.data.name) {
        const nameFilter = input.data.name?.toLowerCase() ?? '';
        printOrders = printOrders.filter(order => order.user.username?.toLowerCase().includes(nameFilter));
      }

      res.status(StatusCodes.OK).json({
        data: printOrders,
        message: "Get all print orders by time successfully",
      });
    },
  );
}
