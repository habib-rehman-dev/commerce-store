import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import * as wishlistService from "./wishlist.service.js";

export const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    const wishlist = await wishlistService.getWishlist(userId!);

    return res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

export const addItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    const wishlist = await wishlistService.addToWishlist(
      userId!,
      req.body.productId,
    );

    return res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    const wishlist = await wishlistService.removeFromWishlist(
      userId!,
      req.params.productId as string,
    );

    return res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};