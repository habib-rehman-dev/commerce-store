import { Router } from "express";
import * as productController from "./product.controller.js";
import {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
} from "./product.validator.js";
import { validate } from "../../shared/middleware/validate.js";
import { parseProductData } from "../../shared/middleware/parseJsonBody.middleware.js";
import { uploadProductImages } from "../../shared/middleware/upload.middleware.js";
import { requireAdmin, requireAuth } from "../../shared/middleware/auth.middleware.js";
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

// POST /api/products
router.post(
  "/",
   requireAuth,
  requireAdmin,
  uploadProductImages,
  parseProductData,
  createProductValidator,
  validate,
  productController.createProduct
);
// PATCH /api/products/:id
router.patch(
  "/:id",
   requireAuth,
  requireAdmin,
  uploadProductImages,
  parseProductData,
  updateProductValidator,
  validate,
  productController.updateProduct,
);
// product.routes.ts
// DELETE /api/products/:id
router.delete("/:id", requireAuth,
  requireAdmin, productController.deleteProduct);
export default router;
