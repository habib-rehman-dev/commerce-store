import { Router } from "express";
// import * as wishlistController from "./wishlist.controller.js";
import * as wishlistController from "./wishlist.controller.js";
import {
  addWishlistItemValidator,
  wishlistItemParamValidator,
} from "./wishlist.validator.js";
import { validate } from "../../shared/middleware/validate.js";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";

const router = Router();

// GET /api/wishlist
router.get("/", requireAuth, wishlistController.getWishlist);

// POST /api/wishlist/items
router.post(
  "/items",
  requireAuth,
  addWishlistItemValidator,
  validate,
  wishlistController.addItem,
);

// DELETE /api/wishlist/items/:productId
router.delete(
  "/items/:productId",
  requireAuth,
  wishlistItemParamValidator,
  validate,
  wishlistController.removeItem,
);

export default router;