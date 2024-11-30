import { JwtProvider } from "../providers/jwt.provider";
import { StatusCodes } from "http-status-codes";
import express from "express";
import { colorText, protectedRoutes, ROLE, spsoRoutes } from "../utils/constant";
import createHttpError from "http-errors";
import { JwtPayload } from "../types/jwt-payload";

const matchPath = (pattern: string, path: string): boolean => {
  const regexPattern = pattern
    .replace(/:[^/]+/g, '[^/]+')
    .replace(/\//g, '\\/');
  
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(path);
};

const isRouteMatched = (
  routes: typeof protectedRoutes | typeof spsoRoutes,
  path: string,
  method: string
): boolean => {
  return routes.some(route => 
    matchPath(route.path, path) && 
    (route.method === 'ALL' || route.method === method)
  );
};

const isAuthorized = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  console.log(colorText, "[ENDPOINT]", req.method, req.path);
  
  const isProtected = isRouteMatched(protectedRoutes, req.path, req.method);
  const isSPSO = isRouteMatched(spsoRoutes, req.path, req.method);
  
  if (isProtected) {
    const accessTokenFromCookie = req.cookies?.accessToken;
    try {
      const accessTokenDecoded: JwtPayload = (await JwtProvider.verifyToken(
        accessTokenFromCookie,
        process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
      )) as JwtPayload;
      req.jwtDecoded = accessTokenDecoded;
      // console.log(req.jwtDecoded);  
      next();
      return;
    } catch (error) {
      if (error instanceof Error && error.message?.includes("jwt expired")) {
        return next(
          createHttpError(StatusCodes.PAYMENT_REQUIRED, "Need to refresh token"),
        );
      }
      return next(
        createHttpError(StatusCodes.UNAUTHORIZED, "Unauthorized: Please login"),
      );
    }
  } else if (isSPSO) {
    const accessTokenFromCookie = req.cookies?.accessToken;
    try {
      const accessTokenDecoded: JwtPayload = (await JwtProvider.verifyToken(
        accessTokenFromCookie,
        process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
      )) as JwtPayload;
      if (accessTokenDecoded.role !== ROLE.spso) {
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
      if (error instanceof Error && error.message?.includes("jwt expired")) {
        return next(
          createHttpError(StatusCodes.PAYMENT_REQUIRED, "Need to refresh token"),
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
