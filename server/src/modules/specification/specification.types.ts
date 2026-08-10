import { Types } from "mongoose";

export interface ISpecificationDefinition {
  name: string;
  categoryId: Types.ObjectId;
  values: string[];
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}