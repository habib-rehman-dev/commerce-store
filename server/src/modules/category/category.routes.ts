import { Router } from "express";
import * as categoryController from "./category.controller.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
} from "./category.validator.js";
import { validate } from "../../shared/middleware/validate.js";
import { uploadSingleImage } from "../../shared/middleware/upload.middleware.js";
import {
  requireAdmin,
  requireAuth,
} from "../../shared/middleware/auth.middleware.js";

const router = Router();

// GET /api/categories
router.get("/", categoryController.getCategories);

// GET /api/categories/slug/gaming-laptops
router.get("/slug/:slug", categoryController.getCategoryBySlug);

// GET /api/categories/:id/children
router.get(
  "/:id/children",
  categoryIdValidator,
  validate,
  categoryController.getChildCategories,
);

// GET /api/categories/:id
router.get(
  "/:id",
  categoryIdValidator,
  validate,
  categoryController.getCategoryById,
);

// POST /api/categories
router.post(
  "/",
  requireAuth,
  requireAdmin,
  uploadSingleImage,
  createCategoryValidator,
  validate,
  categoryController.createCategory,
);

// PATCH /api/categories/:id   // here is missing the image update logic
router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  updateCategoryValidator,
  validate,
  categoryController.updateCategory,
);

// DELETE /api/categories/:id
router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  categoryIdValidator,
  validate,
  categoryController.deleteCategory,
);

export default router;

// router.post(
//   "/",
//   requireAuth(),
//   requireAdmin,
//   createCategoryValidator,
//   validate,
//   categoryController.createCategory,
// );

// // PATCH /api/categories/:id — admin only
// router.patch(
//   "/:id",
//   requireAuth(),
//   requireAdmin,
//   updateCategoryValidator,
//   validate,
//   categoryController.updateCategory,
// );

// // DELETE /api/categories/:id — admin only
// router.delete(
//   "/:id",
//   requireAuth(),
//   requireAdmin,
//   categoryIdValidator,
//   validate,
//   categoryController.deleteCategory,
// );
