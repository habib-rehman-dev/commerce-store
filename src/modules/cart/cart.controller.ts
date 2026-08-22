import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import * as cartService from "./cart.service.js";

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    const cart = await cartService.getCart(userId!);

    return res.status(200).json({ success: true, data: cart });
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
    const cart = await cartService.addItemToCart(userId!, req.body);

    return res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

export const updateItemQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    const cart = await cartService.updateCartItemQuantity(
      userId!,
      req.params.variantId as string,
      req.body.quantity,
    );

    return res.status(200).json({ success: true, data: cart });
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
    const cart = await cartService.removeCartItem(
      userId!,
      req.params.variantId as string,
    );

    return res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    await cartService.clearCart(userId!);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};