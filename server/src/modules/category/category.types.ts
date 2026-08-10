import { Types } from "mongoose";

export interface ICategory {

  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategoryId: Types.ObjectId | null;
  status: "active" | "inactive";
  sortOrder: number;
  imagePublicId?: string; // Add this line
  createdAt: Date;
  updatedAt: Date;
}
