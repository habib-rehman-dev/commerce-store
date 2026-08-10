import { body, param } from "express-validator";

export const createCouponValidator = [
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Coupon code is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Coupon code must be between 3 and 30 characters"),

  body("discountType")
    .notEmpty()
    .withMessage("discountType is required")
    .isIn(["percentage", "fixed"])
    .withMessage("discountType must be 'percentage' or 'fixed'"),

  body("discountValue")
    .isFloat({ min: 0 })
    .withMessage("discountValue must be a non-negative number"),

  body("minOrderValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("minOrderValue must be a non-negative number"),

  body("maxUses")
    .optional()
    .isInt({ min: 1 })
    .withMessage("maxUses must be a positive integer"),

  body("expiresAt")
    .optional()
    .isISO8601()
    .withMessage("expiresAt must be a valid date"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),
];

export const updateCouponValidator = [
  param("id").isMongoId().withMessage("Invalid coupon ID"),

  body("discountType")
    .optional()
    .isIn(["percentage", "fixed"])
    .withMessage("discountType must be 'percentage' or 'fixed'"),

  body("discountValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("discountValue must be a non-negative number"),

  body("minOrderValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("minOrderValue must be a non-negative number"),

  body("maxUses")
    .optional()
    .isInt({ min: 1 })
    .withMessage("maxUses must be a positive integer"),

  body("expiresAt")
    .optional()
    .isISO8601()
    .withMessage("expiresAt must be a valid date"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),
];

export const couponIdValidator = [
  param("id").isMongoId().withMessage("Invalid coupon ID"),
];

export const couponCodeValidator = [
  param("code").trim().notEmpty().withMessage("Coupon code is required"),
];