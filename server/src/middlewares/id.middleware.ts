import express from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

export const validateResourceId = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const id = req.params.id;
  // check if id is a number
  if (!Number(id)) {
    return next(
      createHttpError(StatusCodes.BAD_REQUEST, "Invalid resource id"),
    );
  }
  next();
  return;
};
