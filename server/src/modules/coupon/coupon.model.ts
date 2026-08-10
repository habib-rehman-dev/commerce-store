import { Schema, model } from "mongoose";
import { type ICoupon } from "./coupon.types.js";

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    minOrderValue: {
      type: Number,
      min: 0,
    },

    maxUses: {
      type: Number,
      min: 1,
    },

    // How many times this coupon has actually been applied so far.
    // Order module will increment this later when a coupon is used.
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    expiresAt: {
      type: Date,
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

export const Coupon = model<ICoupon>("Coupon", couponSchema);