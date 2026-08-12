import { Types } from "mongoose";

export interface IWishlist {
  userId: string;
  productIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}