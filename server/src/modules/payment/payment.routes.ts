import { Router } from "express";
import { param } from "express-validator";
import * as paymentController from "./payment.controller.js";
import { validate } from "../../shared/middleware/validate.js";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";

const router = Router();

// POST /api/payments/:orderId/intent
router.post(
  "/:orderId/intent",
  requireAuth,
  [param("orderId").isMongoId().withMessage("Invalid order ID")],
  validate,
  paymentController.createPaymentIntent,
);

export default router;