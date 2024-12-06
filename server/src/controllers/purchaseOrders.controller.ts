import express from "express";
import { BaseController } from "./abstractions/base-controller";
import { prisma } from "../providers/prisma.client";
import { StatusCodes } from "http-status-codes";
import expressAsyncHandler from "express-async-handler";
import RequestValidator from "../middlewares/request-validator";
import { validateResourceId } from "../middlewares/id.middleware";
import { systemProvider } from "../providers/system.provider";
import { PurchaseOrderSchema } from "../schemas/purchaseOrder.schema";
import { ROLE } from "../utils/constant";
import createHttpError from "http-errors";
import { UpdatePurchaseOrderSchema } from "../schemas/purchaseOrder.schema";
import aqp from 'api-query-params';

export default class PurchaseOrdersController extends BaseController {
  public path = "/purchase-orders";
  private systemProviderInstance;

  constructor() {
    super();
    this.systemProviderInstance = systemProvider.getConfig();
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}`, this.getListPurchaseOrders);
    this.router.get(`${this.path}/me`, this.listPurchaseOrders);
    this.router.get(`${this.path}/:id`, this.getPurchaseOrderByUserId);
    this.router.post(
      this.path,
      [new RequestValidator(PurchaseOrderSchema).validate()],
      this.createPurchaseOrder,
    );
    this.router.patch(
      `${this.path}/:id`,
      [validateResourceId, new RequestValidator(UpdatePurchaseOrderSchema).validate()],
      this.updatePurchaseOrder,
    );
  }

  // tạo đơn hàng mua thêm trang in
  private createPurchaseOrder = expressAsyncHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (req.jwtDecoded?.role == ROLE.spso) {
        return next(
          createHttpError(
            StatusCodes.FORBIDDEN,
            "SPSO cannot create purchase order",
          ),
        );
      }
      const { amount, method } = req.body;
      const pricePerA4 = this.systemProviderInstance.PRICE_PER_A4;
      const totalPrice = amount * pricePerA4;
      const purchaseOrder = await prisma.purchaseOrder.create({
        data: {
          amount,
          method,
          price: totalPrice,
          user_id: req.jwtDecoded?.id,
        },
      });
      res.status(StatusCodes.OK).json({
        message: "Purchase order created successfully",
        data: purchaseOrder,
      });
    },
  );

  // thay đổi trạng thái đơn hàng
  private updatePurchaseOrder = expressAsyncHandler(
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const { id } = req.params;
      const { status } = req.body;
      const existingPurchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { purchase_id: parseInt(id) },
      });
      if (!existingPurchaseOrder) {
        return next(
          createHttpError(StatusCodes.NOT_FOUND, "Purchase order not found"),
        );
      } else if (
        existingPurchaseOrder.user_id !== req.jwtDecoded?.id ||
        req.jwtDecoded?.role == ROLE.spso
      ) {
        return next(
          createHttpError(
            StatusCodes.FORBIDDEN,
            `User with email ${req.jwtDecoded?.email} is not authorized to update this purchase order.`,
          ),
        );
      }
      const purchaseOrder = await prisma.purchaseOrder.update({
        where: { purchase_id: parseInt(id) },
        data: { status },
      });
      res.status(StatusCodes.OK).json({
        message: "Purchase order updated successfully",
        data: purchaseOrder,
      });
    },
  );

  // lấy danh sách đơn hàng của user
  private listPurchaseOrders = expressAsyncHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.jwtDecoded?.role == ROLE.spso) {
        return next(
          createHttpError(StatusCodes.FORBIDDEN, "SPSO don't have any purchase orders")
        )
      }
      const purchaseOrders = await prisma.purchaseOrder.findMany({
        where: { user_id: req.jwtDecoded?.id }
      });
      res.status(StatusCodes.OK).json({
        message: `Purchase orders fetched successfully for user with email ${req.jwtDecoded?.email}`,
        data: purchaseOrders,
      });
    }
  );

  // lấy đơn hàng của user theo id
  private getPurchaseOrderByUserId = expressAsyncHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const { id } = req.params;
      const foundUser = await prisma.user.findUnique({
        where: {
          user_id: parseInt(id)
        },
        include: {
          purchaseOrders: true
        }
      })
      res.status(StatusCodes.OK).json({
        message: `Purchase orders fetched successfully for user with id ${id}`,
        data: foundUser?.purchaseOrders,
      });
    }
  );

  private getListPurchaseOrders = expressAsyncHandler(
  async (
    req: express.Request, res: express.Response, next: express.NextFunction
  ) => {
    const { filter, skip, limit, sort, projection, population } = aqp(req.query);
    // set value of entity of sort from 1 to decrease and -1 to increase
    const sortValue = sort ? Object.keys(sort).reduce((acc, key) => {
      acc[key] = sort[key] === 1 ? 'asc' : 'desc';
      return acc;
    }, {} as Record<string, 'asc' | 'desc'>) : undefined;
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where: filter,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            username: true,
            email: true,
            avatar: {
              select: {
                url: true,
              }
            }
          }
        }
      },
      orderBy: sortValue,
    });
    res.status(StatusCodes.OK).json({
      message: "Purchase orders fetched successfully",
      data: purchaseOrders,
    })
  })
}
