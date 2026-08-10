import { Router } from "express";
import * as categoryController from "./category.controller.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
} from "./category.validator.js";
import { validate } from "../../shared/middleware/validate.js";
import { requireAuth, requireAdmin } from "../../shared/middleware/auth.js";

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

// POST /api/categories — admin only
router.post(
  "/",
  requireAuth(),
  requireAdmin,
  createCategoryValidator,
  validate,
  categoryController.createCategory,
);

// PATCH /api/categories/:id — admin only
router.patch(
  "/:id",
  requireAuth(),
  requireAdmin,
  updateCategoryValidator,
  validate,
  categoryController.updateCategory,
);

// DELETE /api/categories/:id — admin only
router.delete(
  "/:id",
  requireAuth(),
  requireAdmin,
  categoryIdValidator,
  validate,
  categoryController.deleteCategory,
);

export default router;









import { Router } from "express";
import * as brandController from "./brand.controller.js";
import {
  createBrandValidator,
  updateBrandValidator,
  brandIdValidator,
} from "./brand.validator.js";
import { validate } from "../../shared/middleware/validate.js";
import { requireAuth, requireAdmin } from "../../shared/middleware/auth.js";

const router = Router();

// GET /api/brands
router.get("/", brandController.getBrands);

// GET /api/brands/slug/nike
router.get("/slug/:slug", brandController.getBrandBySlug);

// GET /api/brands/:id
router.get("/:id", brandIdValidator, validate, brandController.getBrandById);

// POST /api/brands — admin only
router.post(
  "/",
  requireAuth(),
  requireAdmin,
  createBrandValidator,
  validate,
  brandController.createBrand,
);

// PATCH /api/brands/:id — admin only
router.patch(
  "/:id",
  requireAuth(),
  requireAdmin,
  updateBrandValidator,
  validate,
  brandController.updateBrand,
);

// DELETE /api/brands/:id — admin only
router.delete(
  "/:id",
  requireAuth(),
  requireAdmin,
  brandIdValidator,
  validate,
  brandController.deleteBrand,
);

export default router;












import { Router } from "express";
import * as productController from "./product.controller.js";
import {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
} from "./product.validator.js";
import { validate } from "../../shared/middleware/validate.js";
import { requireAuth, requireAdmin } from "../../shared/middleware/auth.js";

const router = Router();

// GET /api/products?categoryId=...&brandId=...&status=active
router.get("/", productController.getProducts);

// GET /api/products/slug/gaming-laptop-x1
router.get("/slug/:slug", productController.getProductBySlug);

// GET /api/products/:id
router.get(
  "/:id",
  productIdValidator,
  validate,
  productController.getProductById,
);

// POST /api/products — admin only
router.post(
  "/",
  requireAuth(),
  requireAdmin,
  createProductValidator,
  validate,
  productController.createProduct,
);

// PATCH /api/products/:id — admin only
router.patch(
  "/:id",
  requireAuth(),
  requireAdmin,
  updateProductValidator,
  validate,
  productController.updateProduct,
);

// DELETE /api/products/:id — admin only
router.delete(
  "/:id",
  requireAuth(),
  requireAdmin,
  productIdValidator,
  validate,
  productController.deleteProduct,
);

export default router;




















import { Router } from "express";
import * as specificationController from "./specification.controller.js";
import {
  createSpecificationValidator,
  updateSpecificationValidator,
  specificationIdValidator,
} from "./specification.validator.js";
import { validate } from "../../shared/middleware/validate.js";
import { requireAuth, requireAdmin } from "../../shared/middleware/auth.js";
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
  requireAuth(),
  requireAdmin,
  createSpecificationValidator,
  validate,
  specificationController.createSpecification,
);

// PATCH /api/specifications/:id — admin only
router.patch(
  "/:id",
  requireAuth(),
  requireAdmin,
  updateSpecificationValidator,
  validate,
  specificationController.updateSpecification,
);

// DELETE /api/specifications/:id — admin only
router.delete(
  "/:id",
  requireAuth(),
  requireAdmin,
  specificationIdValidator,
  validate,
  specificationController.deleteSpecification,
);

export default router;