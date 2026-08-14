import { Router } from "express";
import * as reviewController from "./review.controller.js";
import {
  createReviewValidator,
  updateReviewValidator,
  reviewIdValidator,
  productIdParamValidator,
} from "./review.validator.js";
import { validate } from "../../shared/middleware/validate.js";
import { requireAuth, requireAdmin } from "../../shared/middleware/auth.middleware.js";

const router = Router();

// GET /api/reviews/product/:productId — public, anyone browsing can read reviews
router.get(
  "/product/:productId",
  productIdParamValidator,
  validate,
  reviewController.getReviewsByProduct,
);

// POST /api/reviews — any logged-in customer
router.post(
  "/",
  requireAuth,
  createReviewValidator,
  validate,
  reviewController.createReview,
);

// PATCH /api/reviews/:id — owner only (enforced in service)
router.patch(
  "/:id",
  requireAuth,
  updateReviewValidator,
  validate,
  reviewController.updateReview,
);

// DELETE /api/reviews/:id — owner deleting their OWN review
router.delete(
  "/:id",
  requireAuth,
  reviewIdValidator,
  validate,
  reviewController.deleteOwnReview,
);

// DELETE /api/reviews/admin/:id — admin moderation, can delete ANY review
router.delete(
  "/admin/:id",
  requireAuth,
  requireAdmin,
  reviewIdValidator,
  validate,
  reviewController.adminDeleteReview,
);

export default router;