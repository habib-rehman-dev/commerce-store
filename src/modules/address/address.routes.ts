import { Router } from "express";
import * as addressController from "./address.controller.js";
import {
  createAddressValidator,
  updateAddressValidator,
  addressIdValidator,
} from "./address.validator.js";
import { validate } from "../../shared/middleware/validate.js";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, addressController.getAddresses);

router.get(
  "/:id",
  requireAuth,
  addressIdValidator,
  validate,
  addressController.getAddressById,
);

router.post(
  "/",
  requireAuth,
  createAddressValidator,
  validate,
  addressController.createAddress,
);

router.patch(
  "/:id",
  requireAuth,
  updateAddressValidator,
  validate,
  addressController.updateAddress,
);

router.delete(
  "/:id",
  requireAuth,
  addressIdValidator,
  validate,
  addressController.deleteAddress,
);

export default router;