import { Schema, model } from "mongoose";
import { type IBrand } from "./brand.types.js";

const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    logo: {
      type: String,
      trim: true,
    },
    logoPublicId: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

// Used on the storefront: "show only active brands, alphabetically"
brandSchema.index({ status: 1, name: 1 });

export const Brand = model<IBrand>("Brand", brandSchema);
