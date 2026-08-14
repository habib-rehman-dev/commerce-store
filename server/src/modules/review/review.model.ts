import { Schema, model } from "mongoose";
import { type IReview } from "./review.types.js";

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: String,
      required: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      trim: true,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },

    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// "Show all reviews for this product, newest first" is the main query pattern
reviewSchema.index({ productId: 1, createdAt: -1 });

// One review per user per product — stops review spam/duplicates at the DB level
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const Review = model<IReview>("Review", reviewSchema);