import { stripe } from "../../config/stripe.js";
import { Payment } from "./payment.model.js";
import { Order } from "../order/order.model.js";

export const createPaymentIntent = async (userId: string, orderId: string) => {
  const order = await Order.findOne({ _id: orderId, userId });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.paymentStatus === "paid") {
    throw new Error("This order has already been paid");
  }

  // Stripe expects the smallest currency unit — cents for USD
  const amountInCents = Math.round(order.total * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: order.currency,
    metadata: {
      orderId: order._id.toString(),
      userId,
    },
  });

  await Payment.create({
    orderId: order._id,
    userId,
    provider: "stripe",
    amount: order.total,
    currency: order.currency,
    status: "pending",
    stripePaymentIntentId: paymentIntent.id,
  });

  // clientSecret is what the frontend needs to call stripe.confirmPayment() —
  // it is NOT persisted in our DB, only handed back once here
  return { clientSecret: paymentIntent.client_secret };
};

export const markPaymentSucceeded = async (paymentIntentId: string) => {
  const payment = await Payment.findOneAndUpdate(
    { stripePaymentIntentId: paymentIntentId },
    { status: "succeeded" },
    { new: true },
  );

  if (!payment) return null;

  await Order.findByIdAndUpdate(payment.orderId, {
    paymentStatus: "paid",
    status: "processing",
  });

  return payment;
};

export const markPaymentFailed = async (paymentIntentId: string) => {
  const payment = await Payment.findOneAndUpdate(
    { stripePaymentIntentId: paymentIntentId },
    { status: "failed" },
    { new: true },
  );

  if (!payment) return null;

  await Order.findByIdAndUpdate(payment.orderId, {
    paymentStatus: "failed",
  });

  return payment;
};