import { Types } from "mongoose";
import { Wishlist } from "./wishlist.model.js";
import { Product } from "../product/product.model.js";

const getOrCreateWishlist = async (userId: string) => {
  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, productIds: [] });
  }

  return wishlist;
};

export const addToWishlist = async (userId: string, productId: string) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const wishlist = await getOrCreateWishlist(userId);

  const alreadyExists = wishlist.productIds.some(
    (id) => id.toString() === productId,
  );

  if (!alreadyExists) {
    wishlist.productIds.push(new Types.ObjectId(productId));
    await wishlist.save();
  }

  return wishlist;
};

export const removeFromWishlist = async (
  userId: string,
  productId: string,
) => {
  const wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  wishlist.productIds = wishlist.productIds.filter(
    (id) => id.toString() !== productId,
  );

  await wishlist.save();
  return wishlist;
};

export const getWishlist = async (userId: string) => {
  const wishlist = await Wishlist.findOne({ userId })
    .populate("productIds", "name slug images variants status")
    .lean();

  return wishlist ?? { userId, productIds: [] };
};