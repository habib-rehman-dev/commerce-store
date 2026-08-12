import { Router } from "express";
import * as couponController from "./coupon.controller.js";
import {
  createCouponValidator,
  updateCouponValidator,
  couponIdValidator,
} from "./coupon.validator.js";
import { validate } from "../../shared/middleware/validate.js";
import { requireAuth, requireAdmin } from "../../shared/middleware/auth.middleware.js";

const router = Router();

// GET /api/coupons — admin only, sees ALL coupons including inactive/expired
router.get("/", requireAuth, requireAdmin, couponController.getCoupons);

// GET /api/coupons/:id — admin only
router.get(
  "/:id",
  requireAuth,
  requireAdmin,
  couponIdValidator,
  validate,
  couponController.getCouponById,
);

// POST /api/coupons — admin only
router.post(
  "/",
  requireAuth,
  requireAdmin,
  createCouponValidator,
  validate,
  couponController.createCoupon,
);

// PATCH /api/coupons/:id — admin only
router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  updateCouponValidator,
  validate,
  couponController.updateCoupon,
);

// DELETE /api/coupons/:id — admin only
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  couponIdValidator,
  validate,
  couponController.deleteCoupon,
);

// POST /api/coupons/validate — any logged-in customer, used at checkout
router.post("/validate", requireAuth, couponController.validateCoupon);

export default router;