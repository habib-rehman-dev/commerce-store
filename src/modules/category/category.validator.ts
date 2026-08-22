import { body, param } from "express-validator";

export const createCategoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be between 2 and 100 characters"),

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

  body("image")
    .optional()
    .trim()
    .isURL()
    .withMessage("Image must be a valid URL"),

  body("parentCategoryId")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("Invalid parent category ID"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),

  body("sortOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sort order must be a non-negative integer"),
];

export const updateCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be between 2 and 100 characters"),

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

  body("image")
    .optional()
    .trim()
    .isURL()
    .withMessage("Image must be a valid URL"),

  body("parentCategoryId")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("Invalid parent category ID"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),

  body("sortOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sort order must be a non-negative integer"),
];

export const categoryIdValidator = [
  param("id").isMongoId().withMessage("Invalid category ID"),
];
