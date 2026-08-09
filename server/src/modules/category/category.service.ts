import { Types } from "mongoose";
import { Category } from "./category.model.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";

interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategoryId?: string | null;
  status?: "active" | "inactive";
  sortOrder?: number;
}

interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  parentCategoryId?: string | null;
  status?: "active" | "inactive";
  sortOrder?: number;
}

export const createCategory = async (
  data: CreateCategoryData,
  fileBuffer?: Buffer
) => {
  if (data.parentCategoryId) {
    const parentCategory = await Category.findById(data.parentCategoryId);
    if (!parentCategory) {
      throw new Error("Parent category not found");
    }
  }

  let imageUrl = "";
  if (fileBuffer) {
    const uploadResult = await uploadToCloudinary(fileBuffer, "categories");
    imageUrl = uploadResult.url;
  }

  const newCategory = await Category.create({
    ...data,
    image: imageUrl,
  });

  return newCategory;
};

export const getCategories = async () => {
  return Category.find().sort({ sortOrder: 1, name: 1 }).lean();
};

export const getCategoryById = async (categoryId: string) => {
  return Category.findById(categoryId).lean();
};

export const getCategoryBySlug = async (slug: string) => {
  return Category.findOne({ slug }).lean();
};

export const getChildCategories = async (parentCategoryId: string) => {
  return Category.find({
    parentCategoryId: new Types.ObjectId(parentCategoryId),
    status: "active",
  })
    .sort({ sortOrder: 1, name: 1 })
    .lean();
};

export const updateCategory = async (
  categoryId: string,
  data: UpdateCategoryData,
) => {
  if (data.parentCategoryId) {
    if (data.parentCategoryId === categoryId) {
      throw new Error("A category cannot be its own parent");
    }

    const parentCategory = await Category.findById(data.parentCategoryId);

    if (!parentCategory) {
      throw new Error("Parent category not found");
    }
  }

  const updateData = {
    ...data,
    ...(data.parentCategoryId !== undefined && {
      parentCategoryId: data.parentCategoryId
        ? new Types.ObjectId(data.parentCategoryId)
        : null,
    }),
  };

  return Category.findByIdAndUpdate(categoryId, updateData, {
    new: true,
    runValidators: true,
  }).lean();
};

export const deleteCategory = async (categoryId: string) => {
  const childrenCount = await Category.countDocuments({
    parentCategoryId: new Types.ObjectId(categoryId),
  });

  if (childrenCount > 0) {
    throw new Error("Cannot delete a category that has child categories");
  }

  /*
   * TODO once Product exists: also block deletion if any
   * products reference this category (orphaned reference risk).
   */

  return Category.findByIdAndDelete(categoryId);
};