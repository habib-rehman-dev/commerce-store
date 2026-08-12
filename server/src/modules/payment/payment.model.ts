import { Schema, model } from "mongoose";
import { type IPayment } from "./payment.types.js";

const paymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: String, required: true },

    provider: { type: String, enum: ["stripe"], default: "stripe" },

    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "usd" },

    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
    },

    // Unique per Stripe PaymentIntent — this is what the webhook
    // uses to find which Payment/Order to update
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

paymentSchema.index({ orderId: 1 });

export const Payment = model<IPayment>("Payment", paymentSchema);