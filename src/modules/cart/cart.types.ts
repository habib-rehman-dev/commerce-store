import { Types } from "mongoose";

export interface ICartItem {
  productId: Types.ObjectId;
  variantId: Types.ObjectId;
  quantity: number;
}

export interface ICart {
  userId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}