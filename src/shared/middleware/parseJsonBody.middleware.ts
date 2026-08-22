// src/middlewares/parseJsonBody.middleware.ts
import type { Request, Response, NextFunction } from "express";

export const parseProductData = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (typeof req.body.variants === "string") {
    try {
      req.body.variants = JSON.parse(req.body.variants);
    } catch {
      // Leave as string so validator catches invalid JSON formatting
    }
  }
  next();
};