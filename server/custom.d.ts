import express from "express";
import { type JwtPayload } from "./src/types/jwt-payload";

declare global {
  namespace Express {
    export interface Request {
      jwtDecoded?: JwtPayload | string; // or specify a more precise type if known
    }
  }
}
