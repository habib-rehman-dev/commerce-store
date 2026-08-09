import type { Request, Response, NextFunction } from "express";
import * as productService from "./product.service.js";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await productService.createProduct(req.body);

    return res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId, brandId, status } = req.query;

    const products = await productService.getProducts({
      categoryId: categoryId as string | undefined,
      brandId: brandId as string | undefined,
      status: status as "active" | "inactive" | undefined,
    });

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await productService.updateProduct(
      req.params.id,
      req.body,
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await productService.deleteProduct(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
