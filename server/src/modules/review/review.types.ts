import { Types } from "mongoose";

export interface IReview {
  userId: string; // Clerk userId — same pattern as Address/Cart/Wishlist
  productId: Types.ObjectId;
  rating: number; // 1–5
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}