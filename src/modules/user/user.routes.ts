import { Router } from "express";
import * as userController from "./user.controller.js";
import { requireAuth, requireAdmin } from "../../shared/middleware/auth.middleware.js";

const router = Router();

// GET /api/users/me — any authenticated user
router.get("/me", requireAuth, userController.getMe);

// GET /api/users — admin only
router.get("/", requireAuth, requireAdmin, userController.getUsers);

export default router;