import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import * as paymentService from "./payment.service.js";

export const createPaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    const result = await paymentService.createPaymentIntent(
      userId!,
      req.params.orderId as string,
    );

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};