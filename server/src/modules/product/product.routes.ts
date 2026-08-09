import { Router } from "express";
import * as productController from "./product.controller.js";
import {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
} from "./product.validator.js";
import { validate } from "../../shared/middleware/validate.js";
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
  createProductValidator,
  validate,
  productController.createProduct,
);

// PATCH /api/products/:id
router.patch(
  "/:id",
  updateProductValidator,
  validate,
  productController.updateProduct,
);

// DELETE /api/products/:id
router.delete(
  "/:id",
  productIdValidator,
  validate,
  productController.deleteProduct,
);

export default router;
