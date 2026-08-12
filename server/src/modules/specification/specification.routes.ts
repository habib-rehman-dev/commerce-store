import { Router } from "express";
import * as specificationController from "./specification.controller.js";
import {
  createSpecificationValidator,
  updateSpecificationValidator,
  specificationIdValidator,
} from "./specification.validator.js";
import { validate } from "../../shared/middleware/validate.js";
import { requireAuth , requireAdmin } from "../../shared/middleware/auth.middleware.js";
import { param } from "express-validator";

const router = Router();

// GET /api/specifications/category/:categoryId
router.get(
  "/category/:categoryId",
  [param("categoryId").isMongoId().withMessage("Invalid category ID")],
  validate,
  specificationController.getSpecificationsByCategory,
);

// GET /api/specifications/:id
router.get(
  "/:id",
  specificationIdValidator,
  validate,
  specificationController.getSpecificationById,
);

// POST /api/specifications — admin only
router.post(
  "/",
  requireAuth,
  requireAdmin,
  createSpecificationValidator,
  validate,
  specificationController.createSpecification,
);

// PATCH /api/specifications/:id — admin only
router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  updateSpecificationValidator,
  validate,
  specificationController.updateSpecification,
);

// DELETE /api/specifications/:id — admin only
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  specificationIdValidator,
  validate,
  specificationController.deleteSpecification,
);

export default router;