import { body, param } from "express-validator";

export const createReviewValidator = [
  body("productId").isMongoId().withMessage("Invalid product ID"),

  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("rating must be an integer between 1 and 5"),

  body("title").optional().trim().isLength({ max: 100 }),

  body("comment")
    .trim()
    .notEmpty()
    .withMessage("comment is required")
    .isLength({ min: 5, max: 2000 })
    .withMessage("comment must be between 5 and 2000 characters"),
];

export const updateReviewValidator = [
  param("id").isMongoId().withMessage("Invalid review ID"),

  body("rating").optional().isInt({ min: 1, max: 5 }),
  body("title").optional().trim().isLength({ max: 100 }),
  body("comment").optional().trim().isLength({ min: 5, max: 2000 }),
];

export const reviewIdValidator = [
  param("id").isMongoId().withMessage("Invalid review ID"),
];

export const productIdParamValidator = [
  param("productId").isMongoId().withMessage("Invalid product ID"),
];