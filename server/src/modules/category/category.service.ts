import { Types } from "mongoose";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../config/cloudinary.js";
import { Category } from "./category.model.js";

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
  fileBuffer?: Buffer,
) => {
  // 1. Parent category check (Do this before uploading image to avoid unnecessary upload)
  if (data.parentCategoryId) {
    const parentCategory = await Category.findById(data.parentCategoryId);
    if (!parentCategory) {
      throw new Error("Parent category not found");
    }
  }

  let uploadResult: { url: string; publicId: string } | null = null;

  // 2. Upload image to Cloudinary if file exists
  if (fileBuffer) {
    uploadResult = await uploadToCloudinary(
      fileBuffer,
      "e-commerce_store/categories",
    );
  }

  // 3. Save to database with cleanup on failure
  try {
    const newCategory = await Category.create({
      ...data,
      image: uploadResult?.url || "",
      imagePublicId: uploadResult?.publicId || "", // Storing this helps when deleting category later
    });

    return newCategory;
  } catch (error) {
    // If DB save failed and an image was uploaded, roll back by deleting it
    if (uploadResult?.publicId) {
      await deleteFromCloudinary(uploadResult.publicId);
    }
    throw error;
  }
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

export const deleteCategory = async (id: string) => {
  // 1. Find category to retrieve its imagePublicId
  const category = await Category.findById(id);

  if (!category) {
    return null;
  }

  // 2. Delete image from Cloudinary if a public ID exists
  if (category.imagePublicId) {
    await deleteFromCloudinary(category.imagePublicId);
  }

  // 3. Delete category document from MongoDB
  await category.deleteOne();

  return category;
};