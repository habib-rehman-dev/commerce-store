import { body, param } from "express-validator";

export const createAddressValidator = [
  body("fullName").trim().notEmpty().withMessage("fullName is required"),
  body("phone").trim().notEmpty().withMessage("phone is required"),
  body("addressLine1")
    .trim()
    .notEmpty()
    .withMessage("addressLine1 is required"),
  body("addressLine2").optional().trim(),
  body("city").trim().notEmpty().withMessage("city is required"),
  body("state").trim().notEmpty().withMessage("state is required"),
  body("postalCode").trim().notEmpty().withMessage("postalCode is required"),
  body("country").trim().notEmpty().withMessage("country is required"),
  body("isDefault").optional().isBoolean(),
];

export const updateAddressValidator = [
  param("id").isMongoId().withMessage("Invalid address ID"),
  body("fullName").optional().trim().notEmpty(),
  body("phone").optional().trim().notEmpty(),
  body("addressLine1").optional().trim().notEmpty(),
  body("addressLine2").optional().trim(),
  body("city").optional().trim().notEmpty(),
  body("state").optional().trim().notEmpty(),
  body("postalCode").optional().trim().notEmpty(),
  body("country").optional().trim().notEmpty(),
  body("isDefault").optional().isBoolean(),
];

export const addressIdValidator = [
  param("id").isMongoId().withMessage("Invalid address ID"),
];