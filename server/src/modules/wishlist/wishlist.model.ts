import { Schema, model } from "mongoose";
import { type IWishlist } from "./wishlist.types.js";

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: String,
      required: true,
      unique: true, // one wishlist per user
    },

    productIds: {
      type: [Schema.Types.ObjectId],
      ref: "Product",
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Wishlist = model<IWishlist>("Wishlist", wishlistSchema);