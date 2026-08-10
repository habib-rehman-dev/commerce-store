import { Router } from "express";
import express from "express";
import { handleClerkWebhook } from "./user.webhook.js";

const router = Router();

// POST /api/webhooks/clerk
router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  handleClerkWebhook,
);

export default router;