import express from "express";
import { LoginSchema, RegisterSchema } from "../schemas/user.schema";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

const loginRequest: express.RequestHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) {
    const messages = result.error.issues.map(
      (issue) => `${issue.path} ${issue.message.toLowerCase()}`,
    );
    next(createHttpError(StatusCodes.BAD_REQUEST, messages.join(", ")));
  }
  next();
  return;
};

const registerRequest: express.RequestHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const result = RegisterSchema.safeParse(req.body);
  if (!result.success) {
    const messages = result.error.issues.map(
      (issue) => `${issue.path} ${issue.message.toLowerCase()}`,
    );
    next(createHttpError(StatusCodes.BAD_REQUEST, messages.join(", ")));
  }
  next();
  return;
};

export const userMiddleware = {
  loginRequest,
  registerRequest,
};
