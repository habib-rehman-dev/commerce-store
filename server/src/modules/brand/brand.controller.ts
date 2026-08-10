import type { Request, Response, NextFunction } from "express";
import * as brandService from "./brand.service.js";
import { deleteFromCloudinary } from "../../config/cloudinary.js";

export const createBrand = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("request body", req.body);
  console.log("request file", req.file);
  try {
    const brand = await brandService.createBrand(
      req.body,
      req.file?.buffer
    );

    return res.status(201).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

export const getBrands = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brands = await brandService.getBrands();

    return res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (error) {
    next(error);
  }
};

export const getBrandById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brand = await brandService.getBrandById(req.params.id as string);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

export const getBrandBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brand = await brandService.getBrandBySlug(req.params.slug as string);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBrand = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brand = await brandService.updateBrand(req.params.id as string, req.body);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBrand = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brand = await brandService.deleteBrand(req.params.id as string);

     if (brand?.logoPublicId) {
        await deleteFromCloudinary(brand?.logoPublicId);
      }

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
