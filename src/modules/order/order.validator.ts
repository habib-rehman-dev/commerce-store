import { body, param } from "express-validator";

export const createOrderValidator = [
  body("addressId").isMongoId().withMessage("Invalid address ID"),
  body("couponCode").optional().trim(),
];

export const orderIdValidator = [
  param("id").isMongoId().withMessage("Invalid order ID"),
];

export const updateOrderStatusValidator = [
  param("id").isMongoId().withMessage("Invalid order ID"),
  body("status")
    .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid order status"),
];