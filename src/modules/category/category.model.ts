import { Schema, model } from "mongoose";
import { type ICategory } from "./category.types.js";

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    parentCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    imagePublicId: { type: String, default: "" }, // Add this line
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Used when finding active children of a category
categorySchema.index({
  parentCategoryId: 1,
  status: 1,
});

export const Category = model<ICategory>("Category", categorySchema);
