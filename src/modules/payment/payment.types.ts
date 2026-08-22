import { Types } from "mongoose";

export type PaymentGatewayStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface IPayment {
  orderId: Types.ObjectId;
  userId: string;
  provider: "stripe";
  amount: number;
  currency: string;
  status: PaymentGatewayStatus;
  stripePaymentIntentId: string;
  createdAt: Date;
  updatedAt: Date;
}