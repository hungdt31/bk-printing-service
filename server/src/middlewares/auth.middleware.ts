import { JwtProvider } from "../providers/jwt.provider";
import { StatusCodes } from "http-status-codes";
import express from "express";
import { colorText, protectedRoutes, spsoRoutes } from "../utils/constant";
import createHttpError from "http-errors";
import { JwtPayload } from "../types/jwt-payload";

// Middleware này sẽ đảm nhiệm việc quan trọng: lấy và xác thực JWT accessToken nhận được từ phía FE có hợp lệ hay không
// Chỉ một trong hai cách lấy token: cookie và localstorage
const isAuthorized = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  console.log(colorText, "[ENDPOINT]", req.method, req.originalUrl);
  const isProtected = protectedRoutes.includes(req.originalUrl);
  const isSPSO = spsoRoutes.includes(req.originalUrl);
  if (isProtected) {
    const accessTokenFromCookie = req.cookies?.accessToken;
    try {
      const accessTokenDecoded: JwtPayload = (await JwtProvider.verifyToken(
        accessTokenFromCookie,
        process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
      )) as JwtPayload;
      // console.log(accessTokenDecoded);
      req.jwtDecoded = accessTokenDecoded;
      next();
      return;
    } catch (error) {
      // console.log("Error from authMiddleware: ", error);

      if (error instanceof Error && error.message?.includes("jwt expired")) {
        return next(
          createHttpError(StatusCodes.NOT_FOUND, "Need to refresh token"),
        );
      }

      return next(
        createHttpError(StatusCodes.UNAUTHORIZED, "Unauthorized: Please login"),
      );
    }
    // return next(
    //   createHttpError(
    //     StatusCodes.UNAUTHORIZED,
    //     "You don't have permission to access this endpoint!",
    //   ),
    // );
  } else if (isSPSO) {
    const accessTokenFromCookie = req.cookies?.accessToken;
    // console.log("Access token: ", accessTokenFromCookie);
    try {
      const accessTokenDecoded: JwtPayload = (await JwtProvider.verifyToken(
        accessTokenFromCookie,
        process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
      )) as JwtPayload;
      if (accessTokenDecoded.role !== "SPSO") {
        return next(
          createHttpError(
            StatusCodes.UNAUTHORIZED,
            "You don't have permission to access this endpoint!",
          ),
        );
      }
      req.jwtDecoded = accessTokenDecoded;
      next();
      return;
    } catch (error) {
      // console.log("Error from authMiddleware: ", error);

      if (error instanceof Error && error.message?.includes("jwt expired")) {
        return next(
          createHttpError(StatusCodes.NOT_FOUND, "Need to refresh token"),
        );
      }

      return next(
        createHttpError(StatusCodes.UNAUTHORIZED, "Unauthorized: Please login"),
      );
    }
  }
  next();
};

export const authMiddleware = {
  isAuthorized,
};
