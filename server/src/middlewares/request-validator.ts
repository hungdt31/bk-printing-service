import { z } from "zod";
import { RequestHandler, Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";

class RequestValidator {
  private schema: z.ZodSchema<any>;

  constructor(schema: z.ZodSchema<any>) {
    this.schema = schema;
  }

  validate(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = this.schema.safeParse(req.body);
      if (!result.success) {
        const messages = result.error.issues.map(
          (issue) => `${issue.path.join(".")} ${issue.message}`
        );
        next(createHttpError(StatusCodes.BAD_REQUEST, messages.join(", ")));
        return;
      }
      next();
    };
  }
}

export default RequestValidator;