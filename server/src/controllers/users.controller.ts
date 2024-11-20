import express from "express";
import { BaseController } from "./abstractions/base-controller";
import RequestValidator from "../middlewares/request-validator";
import { prisma } from "../providers/prisma.client";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import { JwtProvider } from "../providers/jwt.provider";
import ms from "ms";
import { JwtPayload } from "../types/jwt-payload";
import { tokenLife } from "../utils/constant";
import { LoginSchema, RegisterSchema } from "../schemas/user.schema";
import { SettingsService } from "../providers/settings.service";
import { UpdateSettingsSchema } from "../schemas/settings.schema";

export default class UsersController extends BaseController {
  public path = "/users";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}/login`,
      [new RequestValidator(LoginSchema).validate()],
      this.login,
    );
    this.router.post(
      `${this.path}/register`,
      [new RequestValidator(RegisterSchema).validate()],
      this.register,
    );
    this.router.put(`${this.path}/refresh-token`, this.refresh_token);
    this.router.get(`${this.path}/profile`, this.profile);
    this.router.delete(`${this.path}/logout`, this.logout);
    this.router.put(
      `${this.path}/update-settings`, 
      [new RequestValidator(UpdateSettingsSchema).validate()],
      this.updateDefaultBalanceAndTimeToAddBalance);
  }

  login = expressAsyncHandler(
    async (
      request: express.Request,
      response: express.Response,
      next: express.NextFunction,
    ) => {
      const customer = await prisma.user.findFirst({
        where: {
          email: request.body.email,
        },
      });
      if (!customer) {
        response
          .status(StatusCodes.FORBIDDEN)
          .json({ message: "Invalid email or password" });
        return;
      }
      const isExactPassword = bcrypt.compareSync(
        request.body.password,
        customer.password,
      );
      if (!isExactPassword) {
        response
          .status(StatusCodes.FORBIDDEN)
          .json({ message: "Invalid email or password." });
        return;
      }

      const customerInfo = {
        id: customer.user_id,
        username: customer.username,
        email: customer.email,
        role: customer.role,
      };

      const accessToken = await JwtProvider.generateToken(
        customerInfo,
        process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
        tokenLife.accessToken,
      );
      const refreshToken = await JwtProvider.generateToken(
        customerInfo,
        process.env.REFRESH_TOKEN_SECRET_SIGNATURE as string,
        tokenLife.refreshToken,
      );
      // console.log("accessToken: ", accessToken);
      response.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: ms("14 days"),
      });

      response.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: ms("14 days"),
      });

      response.status(StatusCodes.OK).json({
        data: {
          customerInfo,
          accessToken,
          refreshToken,
        },
        message: "Login successfully!",
      });
    },
  );

  refresh_token = async (
    request: express.Request,
    response: express.Response,
  ) => {
    const refreshToken = request.cookies?.refreshToken;
    // console.log("refreshToken: ", refreshToken);
    try {
      const refreshTokenDecoded: JwtPayload = (await JwtProvider.verifyToken(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_SIGNATURE as string,
      )) as JwtPayload;

      // console.log("refreshTokenDecoded: ", refreshTokenDecoded);
      const customer = await prisma.user.findUnique({
        where: {
          user_id: refreshTokenDecoded.id,
        },
      });
      if (!customer) {
        response
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Invalid refresh token" });
      }

      // Tạo một accessToken mới
      const accessToken = await JwtProvider.generateToken(
        {
          id: refreshTokenDecoded.id,
          email: refreshTokenDecoded.email,
          username: refreshTokenDecoded.username,
          role: refreshTokenDecoded.role,
        },
        process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
        tokenLife.accessToken,
      );

      // Response lại cookie accessToken mới cho trường hợp sử dụng cookie
      response.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: ms("14 days"),
      });

      // Trả về cho phía client một accessToken mới
      response.status(StatusCodes.OK).json({ accessToken });
    } catch (error) {
      // console.log("Refresh token is not valid!");
      response.status(StatusCodes.UNAUTHORIZED).json({
        message: "Your session is ended. Please login!",
      });
    }
  };

  register = async (request: express.Request, response: express.Response) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(request.body.password, salt);
    const customer = await prisma.user.create({
      data: {
        email: request.body.email,
        username: request.body.username,
        password: hashedPassword,
        role: request.body.role ? request.body.role : "STUDENT",
      },
    });
    response.status(StatusCodes.OK).json({
      data: {
        id: customer.user_id,
        email: customer.email,
        username: customer.username,
      },
      message: "Register successfully!",
    });
  };

  profile = async (request: express.Request, response: express.Response) => {
    response.status(StatusCodes.OK).json({
      profile: request.jwtDecoded,
      message: "Profile information",
    });
  };

  logout = expressAsyncHandler(
    async (request: express.Request, response: express.Response) => {
      response.clearCookie("accessToken");
      response.clearCookie("refreshToken");
      response.status(StatusCodes.OK).json({ message: "Logout successfully" });
    },
  );

  updateDefaultBalanceAndTimeToAddBalance = async (
    request: express.Request,
    response: express.Response,
  ) => {
    await SettingsService.writeSettings(request.body);
    response
      .status(StatusCodes.OK)
      .json({ message: "Update balance successfully" });
  };
}
