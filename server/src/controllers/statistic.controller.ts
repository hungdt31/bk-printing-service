import { BaseController } from "./abstractions/base-controller";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../providers/prisma.client";
import expressAsyncHandler from "express-async-handler";
import { describe } from "node:test";

export default class StatisticController extends BaseController {
  public path = "/statistic";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}/me`, this.getMyStatistic.bind(this));
    this.router.get(this.path, this.getAdminStatistic.bind(this));
  }

  private getMyStatistic = expressAsyncHandler(async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const monthNow = new Date().getMonth() + 1;
    const yearNow = new Date().getFullYear();

    const user = await prisma.user.findFirst({
      where: {
        user_id: req.jwtDecoded?.id
      },
      include: {
        purchaseOrders: {
          where: {
            status: 'PAID',
          },
        },
        printOrders: {
          where: {
            status: 'SUCCESS',
          },
        }
      }
    });

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found"
      });
      return;
    }

    // Tính tổng tiền tháng hiện tại
    const currentMonthOrders = user?.purchaseOrders.filter(order => 
      order.created_at.getMonth() + 1 === monthNow &&
      order.created_at.getFullYear() === yearNow
    );
    const currentMonthTotal = currentMonthOrders?.reduce((acc, cur) => acc + cur.price, 0);

    // Tính tổng tiền tháng trước
    const lastMonth = monthNow === 1 ? 12 : monthNow - 1;
    const lastMonthYear = monthNow === 1 ? yearNow - 1 : yearNow;
    const lastMonthOrders = user?.purchaseOrders.filter(order => 
      order.created_at.getMonth() + 1 === lastMonth &&
      order.created_at.getFullYear() === lastMonthYear
    );
    const lastMonthTotal = lastMonthOrders?.reduce((acc, cur) => acc + cur.price, 0);

    // Tính phần trăm thay đổi
    let percentageChange = 0;
    if (currentMonthTotal && lastMonthTotal && lastMonthTotal > 0) {
      percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    }

    // Tính số lượng printOrders tháng hiện tại
    const currentMonthPrintOrders = user.printOrders.filter(order => 
      order.time_start.getMonth() + 1 === monthNow &&
      order.time_start.getFullYear() === yearNow
    );
    const currentMonthPrintCount = currentMonthPrintOrders.length;
    const currentMonthPageCount = currentMonthPrintOrders.reduce((acc, order) => 
      acc + (order.num_pages_consumed || 0), 0
    );

    // Tính số lượng printOrders tháng trước
    const lastMonthPrintOrders = user.printOrders.filter(order => 
      order.time_start.getMonth() + 1 === lastMonth &&
      order.time_start.getFullYear() === lastMonthYear
    );
    const lastMonthPrintCount = lastMonthPrintOrders.length;
    const lastMonthPageCount = lastMonthPrintOrders.reduce((acc, order) => 
      acc + (order.num_pages_consumed || 0), 0
    );

    // Tính phần trăm thay đổi của printOrders
    let printOrdersPercentageChange = 0;
    if (lastMonthPrintCount > 0) {
      printOrdersPercentageChange = ((currentMonthPrintCount - lastMonthPrintCount) / lastMonthPrintCount) * 100;
    }

    // Tính phần trăm thay đổi của số trang đã in
    let pagesPercentageChange = 0;
    if (lastMonthPageCount > 0) {
      pagesPercentageChange = ((currentMonthPageCount - lastMonthPageCount) / lastMonthPageCount) * 100;
    }

    res.status(StatusCodes.OK).json({
      data: {
        purchaseOrders: {
          currentMonth: currentMonthTotal,
          lastMonth: lastMonthTotal,
          percentageChange: Math.round(percentageChange * 100) / 100,
          trend: percentageChange > 0 ? 'increase' : percentageChange < 0 ? 'decrease' : 'unchanged',
        },
        printOrders: {
          orders: {
            currentMonth: currentMonthPrintCount,
            lastMonth: lastMonthPrintCount,
            percentageChange: Math.round(printOrdersPercentageChange * 100) / 100,
            trend: printOrdersPercentageChange > 0 ? 'increase' : printOrdersPercentageChange < 0 ? 'decrease' : 'unchanged'
          },
          pages: {
            currentMonth: currentMonthPageCount,
            lastMonth: lastMonthPageCount,
            percentageChange: Math.round(pagesPercentageChange * 100) / 100,
            trend: pagesPercentageChange > 0 ? 'increase' : pagesPercentageChange < 0 ? 'decrease' : 'unchanged'
          }
        }
      },
      message: "Get your statistic successfully"
    });
  });

  private getAdminStatistic = expressAsyncHandler(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    
    // Tính tổng tiền cho tháng hiện tại
    const currentMonthPurchase = await prisma.purchaseOrder.findMany({
      where: {
        status: 'PAID',
        updated_at: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 0)
        }
      }
    });
    const currentMonthTotal = currentMonthPurchase.reduce((acc, cur) => acc + cur.price, 0);
    
    // Tính tổng tiền cho tháng trước
    const lastMonthPurchase = await prisma.purchaseOrder.findMany({
      where: {
        status: 'PAID',
        created_at: {
          gte: new Date(year, month - 2, 1),
          lt: new Date(year, month - 1, 0)
        }
      }
    });
    const lastMonthTotal = lastMonthPurchase.reduce((acc, cur) => acc + cur.price, 0);
    
    // Tính phần trăm thay đổi cho tổng tiền
    let purchasePercentageChange = 0;
    if (lastMonthTotal > 0) {
      purchasePercentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
    }

    // Tính số lượng printOrders và số trang tiêu thụ cho tháng hiện tại
    const currentMonthPrintOrders = await prisma.printOrder.findMany({
      where: {
        time_start: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 0)
        }
      }
    });
    const currentMonthPrintCount = currentMonthPrintOrders.length;
    const currentMonthPagesConsumed = currentMonthPrintOrders.reduce((acc, order) => acc + (order.num_pages_consumed || 0), 0);

    // Tính số lượng printOrders và số trang tiêu thụ cho tháng trước
    const lastMonthPrintOrders = await prisma.printOrder.findMany({
      where: {
        time_start: {
          gte: new Date(year, month - 2, 1),
          lt: new Date(year, month - 1, 0)
        }
      }
    });
    const lastMonthPrintCount = lastMonthPrintOrders.length;
    const lastMonthPagesConsumed = lastMonthPrintOrders.reduce((acc, order) => acc + (order.num_pages_consumed || 0), 0);

    // Tính phần trăm thay đổi cho số lượng printOrders
    let printOrdersPercentageChange = 0;
    if (lastMonthPrintCount > 0) {
      printOrdersPercentageChange = ((currentMonthPrintCount - lastMonthPrintCount) / lastMonthPrintCount) * 100;
    }

    // Tính phần trăm thay đổi cho số trang tiêu thụ
    let pagesPercentageChange = 0;
    if (lastMonthPagesConsumed > 0) {
      pagesPercentageChange = ((currentMonthPagesConsumed - lastMonthPagesConsumed) / lastMonthPagesConsumed) * 100;
    }

    const printers = await prisma.printer.findMany();
    res.status(StatusCodes.OK).json({
      data: {
        purchaseOrders: {
          describe: "Total money earned in this month",
          amount: currentMonthTotal,
          lastMonthAmount: lastMonthTotal,
          percentageChange: Math.round(purchasePercentageChange * 100) / 100,
          trend: purchasePercentageChange > 0 ? 'increase' : purchasePercentageChange < 0 ? 'decrease' : 'unchanged'
        },
        printOrders: {
          describe: "Total print orders in this month",
          currentMonthCount: currentMonthPrintCount,
          lastMonthCount: lastMonthPrintCount,
          currentMonthPagesConsumed: currentMonthPagesConsumed,
          lastMonthPagesConsumed: lastMonthPagesConsumed,
          percentageChange: Math.round(printOrdersPercentageChange * 100) / 100,
          trend: printOrdersPercentageChange > 0 ? 'increase' : printOrdersPercentageChange < 0 ? 'decrease' : 'unchanged'
        },
        pages: {
          describe: "Total pages consumed in this month",
          currentMonthPagesConsumed: currentMonthPagesConsumed,
          lastMonthPagesConsumed: lastMonthPagesConsumed,
          percentageChange: Math.round(pagesPercentageChange * 100) / 100,
          trend: pagesPercentageChange > 0 ? 'increase' : pagesPercentageChange < 0 ? 'decrease' : 'unchanged'
        }
      },
      message: "Get admin statistic successfully"
    });
  });
}