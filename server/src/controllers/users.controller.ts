import express from "express";
import { BaseController } from "./abstractions/base-controller";
import { userMiddleware } from "../middlewares/user.middleware";
import { prisma } from "../providers/prisma.client";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import { JwtProvider } from "../providers/jwt.provider";
import ms from "ms";
import { userInfo } from "os";
import { JwtPayload } from "../types/jwt-payload";
import { tokenLife } from "../utils/constant";

export default class UsersController extends BaseController {
  public path = "/users";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}/login`,
      [userMiddleware.loginRequest],
      this.login,
    );
    this.router.post(
      `${this.path}/register`,
      [userMiddleware.registerRequest],
      this.register,
    );
    this.router.put(`${this.path}/refresh-token`, this.refresh_token);
    this.router.get(`${this.path}/profile`, this.profile);
    this.router.delete(`${this.path}/logout`, this.logout);
  }

  login = expressAsyncHandler(
    async (
      request: express.Request,
      response: express.Response,
      next: express.NextFunction,
    ) => {
      const customer = await prisma.customer.findFirst({
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
        id: customer.customer_id,
        name: customer.name,
        email: customer.email,
        type: customer.type,
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
      const customer = await prisma.customer.findUnique({
        where: {
          customer_id: refreshTokenDecoded.id,
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
          name: refreshTokenDecoded.name,
          type: refreshTokenDecoded.type,
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
    const customer = await prisma.customer.create({
      data: {
        email: request.body.email,
        name: request.body.name,
        password: hashedPassword,
        type: request.body.type ? request.body.type : "STUDENT",
      },
    });
    response.status(StatusCodes.OK).json({
      data: {
        id: customer.customer_id,
        email: customer.email,
        name: customer.name,
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
}
