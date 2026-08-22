import express, { type Request, type Response } from "express";
import cors from "cors";
import { corsOptions } from "./config/cors.js";
import { clerkMiddleware } from "./shared/middleware/auth.middleware.js";

// import addressRoutes from "@/src/modules/address/address.routes.js"
import categoryRoutes from "./modules/category/category.routes.js";
import brandRoutes from "./modules/brand/brand.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import specificationRoutes from "./modules/specification/specification.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import userWebhookRoutes from "./modules/user/user.webhook.routes.js";
import couponRoutes from "./modules/coupon/coupon.routes.js";
import addressRoutes from "./modules/address/address.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import wishlistRoutes from "./modules/wishlist/wishlist.routes.js";
import orderRoutes from "./modules/order/order.routes.js";
import paymentRoutes from "./modules/payment/payment.routes.js";
import paymentWebhookRoutes from "./modules/payment/payment.webhook.routes.js";
import reviewRoutes from "./modules/review/review.routes.js";

const app = express();

app.use(cors(corsOptions));

/*
 * CRITICAL ORDERING: the webhook route needs the RAW request body to
 * verify Clerk's signature, so it's mounted BEFORE express.json().
 * If you move this below express.json(), webhook verification will
 * break silently with a confusing signature-mismatch error.
 */
app.use("/api/webhooks", userWebhookRoutes);
app.use("/api/webhooks", paymentWebhookRoutes);

app.use(express.json());

// clerkMiddleware() attaches auth state to every request from here down.
// It does NOT block unauthenticated requests by itself — requireAuth() does that per-route.
app.use(clerkMiddleware());

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "API is running" });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/specifications", specificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

// 404 for any route that didn't match above
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

/*
 * TODO: centralized error-handling middleware goes here, as the
 * very last app.use(). It needs 4 params (err, req, res, next) —
 * that's how Express identifies it as an error handler. We're
 * still relying on default Express error handling for now.
 */

export default app;