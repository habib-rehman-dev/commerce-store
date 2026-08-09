import { body, param } from "express-validator";

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("Product name must be between 2 and 150 characters"),

  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Slug must contain only lowercase letters, numbers and hyphens"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),

  body("categoryId")
    .notEmpty()
    .withMessage("categoryId is required")
    .isMongoId()
    .withMessage("Invalid category ID"),

  body("brandId")
    .notEmpty()
    .withMessage("brandId is required")
    .isMongoId()
    .withMessage("Invalid brand ID"),

  body("images")
    .optional()
    .isArray()
    .withMessage("images must be an array"),

  body("images.*")
    .optional()
    .isURL()
    .withMessage("Each image must be a valid URL"),

  // --- Variants: this is the part that's easy to get wrong ---
  body("variants")
    .isArray({ min: 1 })
    .withMessage("A product must have at least one variant"),

  body("variants.*.sku")
    .trim()
    .notEmpty()
    .withMessage("Each variant needs a sku"),

  body("variants.*.price")
    .isFloat({ min: 0 })
    .withMessage("Each variant needs a valid non-negative price"),

  body("variants.*.discountPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("discountPrice must be a non-negative number"),

  body("variants.*.stock")
    .isInt({ min: 0 })
    .withMessage("Each variant needs a non-negative integer stock"),

  body("variants.*.attributes")
    .optional()
    .isObject()
    .withMessage("attributes must be an object, e.g. { color: 'Red' }"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),
];

export const updateProductValidator = [
  param("id").isMongoId().withMessage("Invalid product ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Product name must be between 2 and 150 characters"),

  body("slug")
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Invalid slug format"),

  body("categoryId")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID"),

  body("brandId")
    .optional()
    .isMongoId()
    .withMessage("Invalid brand ID"),

  body("variants")
    .optional()
    .isArray({ min: 1 })
    .withMessage("A product must have at least one variant"),

  body("variants.*.sku")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Each variant needs a sku"),

  body("variants.*.price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Each variant needs a valid non-negative price"),

  body("variants.*.stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Each variant needs a non-negative integer stock"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),
];

export const productIdValidator = [
  param("id").isMongoId().withMessage("Invalid product ID"),
];
