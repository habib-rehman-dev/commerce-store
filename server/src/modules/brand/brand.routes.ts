import { Router } from "express";
import * as brandController from "./brand.controller.js";
import {
  createBrandValidator,
  updateBrandValidator,
  brandIdValidator,
} from "./brand.validator.js";
import { validate } from "../../shared/middleware/validate.js";
import {  uploadSingleLogo } from "../../shared/middleware/upload.middleware.js";
import { requireAdmin, requireAuth } from "../../shared/middleware/auth.middleware.js";

const router = Router();

// GET /api/brands
router.get("/", brandController.getBrands);

// GET /api/brands/slug/nike
router.get("/slug/:slug", brandController.getBrandBySlug);

// GET /api/brands/:id
router.get("/:id", brandIdValidator, validate, brandController.getBrandById);

// POST /api/brands
router.post(
  "/",
  requireAuth,
  requireAdmin,
  uploadSingleLogo,
  createBrandValidator,
  validate,
  brandController.createBrand,
);


// PATCH /api/brands/:id
router.patch(
  "/:id",
   requireAuth,
  requireAdmin,
  updateBrandValidator,
  validate,
  brandController.updateBrand,
);

// DELETE /api/brands/:id
router.delete(
  "/:id",
   requireAuth,
  requireAdmin,
  brandIdValidator,
  validate,
  brandController.deleteBrand,
);

export default router;
