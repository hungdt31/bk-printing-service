import express from "express";
export const notFoundRoute = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  res.status(404).send({
    status: 404,
    message: `Cannot ${req.method} ${req.url}`,
  });
};
