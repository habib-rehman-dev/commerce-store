import { Router } from "express";
import * as cartController from "./cart.controller.js";
import {
  addCartItemValidator,
  updateCartItemValidator,
  cartItemParamValidator,
} from "./cart.validator.js";
import { validate } from "../../shared/middleware/validate.js";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";

const router = Router();

// GET /api/cart
router.get("/", requireAuth, cartController.getCart);

// POST /api/cart/items
router.post(
  "/items",
  requireAuth,
  addCartItemValidator,
  validate,
  cartController.addItem,
);

// PATCH /api/cart/items/:variantId
router.patch(
  "/items/:variantId",
  requireAuth,
  updateCartItemValidator,
  validate,
  cartController.updateItemQuantity,
);

// DELETE /api/cart/items/:variantId
router.delete(
  "/items/:variantId",
  requireAuth,
  cartItemParamValidator,
  validate,
  cartController.removeItem,
);

// DELETE /api/cart
router.delete("/", requireAuth, cartController.clearCart);

export default router;