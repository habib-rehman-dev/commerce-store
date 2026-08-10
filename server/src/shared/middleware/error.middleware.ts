import type{ Request, Response, NextFunction } from "express";
import multer from "multer";
import { AppError } from "../../utils/AppError.js";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || null;

  // 1. Mongoose Validation Errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // 2. Mongoose Duplicate Key Error (e.g., unique category name/slug)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for '${field}'. Please use another value.`;
  }

  // 3. Mongoose CastError (Invalid MongoDB ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid resource ID: ${err.value}`;
  }

  // 4. Multer Upload Errors
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size limit exceeded (Max 5MB allowed)";
    } else {
      message = `Upload error: ${err.message}`;
    }
  }

  // Standardized Output Structure
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};