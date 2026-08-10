import type { Request, Response, NextFunction } from "express";
import * as specificationService from "./specification.service.js";

export const createSpecification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const specification = await specificationService.createSpecification(
      req.body,
    );

    return res.status(201).json({
      success: true,
      data: specification,
    });
  } catch (error) {
    next(error);
  }
};

export const getSpecificationsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const specifications =
      await specificationService.getSpecificationsByCategory(
        req.params.categoryId as string,
      );

    return res.status(200).json({
      success: true,
      data: specifications,
    });
  } catch (error) {
    next(error);
  }
};

export const getSpecificationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const specification = await specificationService.getSpecificationById(
      req.params.id as string,
    );

    if (!specification) {
      return res.status(404).json({
        success: false,
        message: "Specification not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: specification,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSpecification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const specification = await specificationService.updateSpecification(
      req.params.id as string,
      req.body,
    );

    if (!specification) {
      return res.status(404).json({
        success: false,
        message: "Specification not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: specification,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSpecification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const specification = await specificationService.deleteSpecification(
      req.params.id as string,
    );

    if (!specification) {
      return res.status(404).json({
        success: false,
        message: "Specification not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
