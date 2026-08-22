import { Router } from "express";
import * as orderController from "./order.controller.js";
import {
  createOrderValidator,
  orderIdValidator,
  updateOrderStatusValidator,
} from "./order.validator.js";
import { validate } from "../../shared/middleware/validate.js";
import { requireAuth, requireAdmin } from "../../shared/middleware/auth.middleware.js";

const router = Router();

// Customer — own orders only
router.post(
  "/",
  requireAuth,
  createOrderValidator,
  validate,
  orderController.createOrder,
);

router.get("/", requireAuth, orderController.getOrders);

router.get(
  "/:id",
  requireAuth,
  orderIdValidator,
  validate,
  orderController.getOrderById,
);

// Admin — all orders
router.get(
  "/admin/all",
  requireAuth,
  requireAdmin,
  orderController.getAllOrders,
);

router.patch(
  "/admin/:id/status",
  requireAuth,
  requireAdmin,
  updateOrderStatusValidator,
  validate,
  orderController.updateOrderStatus,
);

export default router;