import type { Request, Response, NextFunction } from "express";
import { stripe } from "../../config/stripe.js";
import { env } from "../../config/env.js";
import * as paymentService from "./payment.service.js";
import Stripe from "stripe";

export const handleStripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      return res.status(400).json({ success: false, message: "Missing stripe-signature header" });
    }

    /*
     * Same rule as the Clerk webhook: req.body must be the raw,
     * unparsed body here — Stripe's signature is computed over the
     * exact bytes it sent. This route is mounted with express.raw()
     * BEFORE express.json() in index.ts.
     */
    const event = stripe.webhooks.constructEvent(
      req.body as Buffer,
      signature as string,
      env.STRIPE_WEBHOOK_SECRET,
    );

    switch (event.type) {
      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent;
        await paymentService.markPaymentSucceeded(intent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        await paymentService.markPaymentFailed(intent.id);
        break;
      }

      // Other event types ignored for now
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};