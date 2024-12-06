import { BaseController } from "./abstractions/base-controller";
import { SystemProvider, systemProvider } from "../providers/system.provider";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UpdateSettingsSchema } from "../schemas/config.schema";
import RequestValidator from "../middlewares/request-validator";
import createHttpError from "http-errors";
import expressAsyncHandler from "express-async-handler";

export default class ConfigController extends BaseController {
  public path = "/config";
  private systemProviderInstance: SystemProvider;

  constructor() {
    super();
    this.systemProviderInstance = systemProvider;
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(
      this.path, 
      this.getConfig
    );
    this.router.put(
      this.path, 
      [new RequestValidator(UpdateSettingsSchema).validate()],
      this.updateConfig
    );
  }

  private getConfig = async (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
      data: this.systemProviderInstance.getConfig(),
      message: "Get config successfully"
    });
  }

  private updateConfig = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    systemProvider.updateConfig(req.body);
    res.status(StatusCodes.OK).json({
      data: this.systemProviderInstance.getConfig(),
      message: "Update config successfully"
    });
  });
}
