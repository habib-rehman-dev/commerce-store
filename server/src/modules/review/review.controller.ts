import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import * as reviewService from "./review.service.js";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    const review = await reviewService.createReview(userId!, req.body);

    return res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

export const getReviewsByProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [reviews, summary] = await Promise.all([
      reviewService.getReviewsByProduct(req.params.productId as string),
      reviewService.getProductRatingSummary(req.params.productId as string),
    ]);

    return res.status(200).json({
      success: true,
      data: { reviews, summary },
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    const review = await reviewService.updateReview(
      userId!,
      req.params.id as string,
      req.body,
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    return res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

export const deleteOwnReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    const review = await reviewService.deleteOwnReview(userId!, req.params.id as string);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const adminDeleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const review = await reviewService.adminDeleteReview(req.params.id as string);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};