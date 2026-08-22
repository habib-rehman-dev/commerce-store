import { body, param } from "express-validator";

export const addWishlistItemValidator = [
  body("productId").isMongoId().withMessage("Invalid product ID"),
];

export const wishlistItemParamValidator = [
  param("productId").isMongoId().withMessage("Invalid product ID"),
];