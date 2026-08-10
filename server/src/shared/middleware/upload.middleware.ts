import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory for processing

export const uploadSingleImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("image"); // "image" is the key name in Postman


export const uploadSingleLogo = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("logo"); // "image" is the key name in Postman

// src/middlewares/upload.middleware.ts

export const uploadProductImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
}).array("images", 5); // Accepts up to 5 files under key 'images'