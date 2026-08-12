import { clerkMiddleware, getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";

// Re-export built-in Clerk middlewares
export { clerkMiddleware };

/*
 * IMPORTANT setup step (Clerk Dashboard):
 * Sessions → Customize session token → add claim:
 * { "metadata": "{{user.public_metadata}}" }
 */

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthenticated access",
    });
  }

  next();
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId, sessionClaims } = getAuth(req);

  // 1. Ensure user is authenticated
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthenticated",
    });
  }

  // 2. Check publicMetadata for admin role
  console.log("Session Claims:", sessionClaims); // Debugging line
  const metadata = sessionClaims?.metadata as { role?: string } | undefined;

  if (metadata?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};