import express, { type Request, type Response } from "express";
import cors from 'cors'
import { corsOptions } from "./config/cors.js";

import categoryRoutes from "./modules/category/category.routes.js";
import brandRoutes from "./modules/brand/brand.routes.js";
import productRoutes from "./modules/product/product.routes.js";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "API is running" });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);

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
