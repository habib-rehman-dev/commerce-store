import { Types } from "mongoose";

export interface IProductVariant {
  sku: string;
  attributes: Record<string, string>; // e.g. { color: "Red", size: "M" }
  price: number;
  discountPrice?: number;
  stock: number;
  images?: string[];
}

export interface IProduct {
  name: string;
  slug: string;
  description?: string;
  categoryId: Types.ObjectId;
  imagePublicIds?: string[];
  brandId: Types.ObjectId;
  images: string[];
  variants: IProductVariant[];
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}
