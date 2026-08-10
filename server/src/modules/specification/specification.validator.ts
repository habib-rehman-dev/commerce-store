import { body, param } from "express-validator";

export const createSpecificationValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Specification name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Specification name must be between 2 and 100 characters"),

  body("categoryId")
    .notEmpty()
    .withMessage("categoryId is required")
    .isMongoId()
    .withMessage("Invalid category ID"),

  body("values")
    .isArray({ min: 1 })
    .withMessage("At least one allowed value is required"),

  body("values.*")
    .trim()
    .notEmpty()
    .withMessage("Each value must be a non-empty string"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),
];

export const updateSpecificationValidator = [
  param("id").isMongoId().withMessage("Invalid specification ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Specification name must be between 2 and 100 characters"),

  body("values")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one allowed value is required"),

  body("values.*")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Each value must be a non-empty string"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),
];

export const specificationIdValidator = [
  param("id").isMongoId().withMessage("Invalid specification ID"),
];