import { Router } from "express";
import express from "express";
import { handleStripeWebhook } from "./payment.webhook.js";

const router = Router();

// POST /api/webhooks/stripe
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

export default router;