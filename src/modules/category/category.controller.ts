import type { Request, Response, NextFunction } from "express";
import * as categoryService from "./category.service.js";

import { Category } from "./category.model.js";
import { deleteFromCloudinary } from "../../config/cloudinary.js";


export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("request body", req.body);
    const category = await categoryService.createCategory(
      req.body,
      req.file?.buffer
    );

    return res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await categoryService.getCategories();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await categoryService.getCategoryById(
      req.params.id as string,
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await categoryService.getCategoryBySlug(
      req.params.slug as string,
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getChildCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await categoryService.getChildCategories(
      req.params.id as string,
    );

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id as string,
      req.body,
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
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