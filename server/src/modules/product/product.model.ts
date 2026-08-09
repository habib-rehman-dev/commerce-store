import { Schema, model } from "mongoose";
import { type IProduct, type IProductVariant } from "./product.types.js";

const productVariantSchema = new Schema<IProductVariant>(
  {
    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    // Flexible key-value pairs, e.g. { color: "Red", size: "M" }
    attributes: {
      type: Map,
      of: String,
      default: {},
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    images: {
      type: [String],
      default: [],
    },
  },
  {
    // Each variant still gets its own _id automatically —
    // we WANT that, since carts/orders will reference a specific variantId.
    timestamps: false,
  },
);

const productSchema = new Schema<IProduct>(
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

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    variants: {
      type: [productVariantSchema],
      validate: {
        validator: (variants: IProductVariant[]) => variants.length > 0,
        message: "A product must have at least one variant",
      },
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

// Used for storefront filtering: "products in this category/brand"
productSchema.index({ categoryId: 1, status: 1 });
productSchema.index({ brandId: 1, status: 1 });

// Enforces SKU uniqueness across ALL products, not just within one
productSchema.index({ "variants.sku": 1 }, { unique: true });

export const Product = model<IProduct>("Product", productSchema);
