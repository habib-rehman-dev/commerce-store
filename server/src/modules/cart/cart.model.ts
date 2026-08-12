import { Schema, model } from "mongoose";
import { type ICart, type ICartItem } from "./cart.types.js";

const cartItemSchema = new Schema<ICartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Points at the specific variant _id INSIDE that product's variants array
    variantId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: false,
  },
);

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: String,
      required: true,
      unique: true, // one cart per user
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Cart = model<ICart>("Cart", cartSchema);