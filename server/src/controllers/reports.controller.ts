import { BaseController } from "./abstractions/base-controller";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../providers/prisma.client";
import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

interface TotalMoneyForPurchasePage {
  method: "MOMO" | "ZALOPAY" | "BANKING";
  total: number;
}

export default class ReportsController extends BaseController {
  public path = "/reports";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}`, this.generateReport.bind(this));
  }

  public generateReport = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // Tổng số trang đã in
      let { year, month } = req.query;
      if (!year) {
        return next(createHttpError(400, "Year are required"));
      }
      let greaterDay = null;
      let lessEqualDay = null;
      if (!month) {
        greaterDay = new Date(Number(year), 0, 1).toISOString();
        lessEqualDay = new Date(Number(year) + 1, 0, 1).toISOString();
      } else {
        greaterDay = new Date(Number(year), Number(month) - 1, 1).toISOString();
        lessEqualDay = new Date(Number(year), Number(month), 1).toISOString();
      }

      const reports = await prisma.report.findFirst({
        where: {
          year: Number(year),
          month: Number(month),
        },
        include: {
          printOrders: {
            include: {
              printOrder: true,
            },
          },
        },
      });

      if (!reports) {
        return next(createHttpError(404, "Report not found"));
      }

      const purchaseOrders = await prisma.purchaseOrder.findMany({
        where: {
          status: "PAID",
          updated_at: {
            lte: new Date(lessEqualDay),
            gt: new Date(greaterDay),
          },
        },
      });

      let printers = await prisma.printer.findMany({
        select: {
          name: true,
          status: true,
          printOrders: {
            where: {
              time_start: {
                gte: new Date(greaterDay),
                lte: new Date(lessEqualDay),
              }
            }
          }
        },
      });

      let anaslystPrinter = printers.map((printer) => 
        ({
          name: printer.name,
          status: printer.status,
          _count: {
            printOrders: printer.printOrders.length,
            printingTime: printer.printOrders.reduce((acc, order) => {
              if (order.time_end && order.time_start) {
                return acc + (order.time_end.getTime() - order.time_start.getTime());
              }
              return acc;
            }, 0) / 60000,
          },
        })
      );
      // 1. Lấy ra tổng số trang in theo từng loại giấy
      // 2. Tính tổng số sinh viên đã sử dụng dịch vụ in
      // 3. Tính tổng số tiền đã thu được từ việc in
      // 4. Lấy ra tổng thời gian in của từng máy in
      let totalA4Pages = 0;
      let totalA3Pages = 0;
      let totalUsingPrinters = 0;
      const userSet = new Set();
      const paymentMap = new Map<
        TotalMoneyForPurchasePage["method"],
        TotalMoneyForPurchasePage["total"]
      >();

      paymentMap.set("MOMO", 0);
      paymentMap.set("ZALOPAY", 0);
      paymentMap.set("BANKING", 0);

      purchaseOrders.map((order) => {
        const value = paymentMap.get(order.method) || 0;
        paymentMap.set(order.method, value + order.price);
      });

      const payments = Array.from(paymentMap);
      reports?.printOrders.map((item) => {
        if (item.printOrder.page_size === "A4") {
          totalA4Pages += item.printOrder.pages_to_be_printed.length;
        } else {
          totalA3Pages += item.printOrder.pages_to_be_printed.length;
        }

        if (!userSet.has(item.printOrder.user_id)) {
          userSet.add(item.printOrder.user_id);
        }

        if (item.printOrder.time_end && item.printOrder.time_start)
          totalUsingPrinters +=
            item.printOrder.time_end.getTime() -
            item.printOrder.time_start.getTime();
      });

      const users = await prisma.user.findMany({
        where: {
          user_id: {
            in: [...userSet] as number[],
          },
        },
        select: {
          user_id: true,
          username: true,
          email: true,
          role: true,
          avatar: {
            select: {
              url: true,
              path: true,
            }
          },
          printOrders: {
            where: {
              print_id: {
                in: reports.printOrders.map((item) => item.print_id),
              }
            },
            select: {
              num_pages_consumed: true,
            },
          },
        },
      });

      // Tính tổng số trang đã in của từng người dùng
      const usersUsedService = users.map((user) => {
        const totalConsumedPages = user.printOrders.reduce(
          (total, order) => total + (order.num_pages_consumed || 0),
          0,
        );
        return {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          totalConsumedPages,
        };
      }).slice(0, 5);

      res.status(StatusCodes.OK).json({
        data: {
          printOrder: {
            totalA4Pages,
            totalA3Pages,
            usersUsedService,
          },
          purchaseOrder: {
            payments,
            total: payments.reduce((acc, [_, value]) => acc + value, 0),
          },
          printer: {
            printers: anaslystPrinter,
            // đổi từ milisecond sang phút
            totalUsingPrinters: totalUsingPrinters / 60000,
          },
        },
        message: "Report generated successfully",
      });
    },
  );
}
