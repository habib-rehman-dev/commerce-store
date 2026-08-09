import { Types } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategoryId: Types.ObjectId | null;
  status: "active" | "inactive";
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
