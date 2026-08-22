import { body, param } from "express-validator";

export const addCartItemValidator = [
  body("productId").isMongoId().withMessage("Invalid product ID"),
  body("variantId").isMongoId().withMessage("Invalid variant ID"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("quantity must be a positive integer"),
];

export const updateCartItemValidator = [
  param("variantId").isMongoId().withMessage("Invalid variant ID"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("quantity must be a positive integer"),
];

export const cartItemParamValidator = [
  param("variantId").isMongoId().withMessage("Invalid variant ID"),
];