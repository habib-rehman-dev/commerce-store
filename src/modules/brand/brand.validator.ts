import { body, param } from "express-validator";

export const createBrandValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Brand name must be between 2 and 100 characters"),

  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Slug must contain only lowercase letters, numbers and hyphens"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("logo")
    .optional()
    .trim()
    .isURL()
    .withMessage("Logo must be a valid URL"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),
];

export const updateBrandValidator = [
  param("id").isMongoId().withMessage("Invalid brand ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Brand name must be between 2 and 100 characters"),

  body("slug")
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Invalid slug format"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("logo")
    .optional()
    .trim()
    .isURL()
    .withMessage("Logo must be a valid URL"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),
];

export const brandIdValidator = [
  param("id").isMongoId().withMessage("Invalid brand ID"),
];
