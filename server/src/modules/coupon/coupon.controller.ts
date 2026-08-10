import type { Request, Response, NextFunction } from "express";
import * as couponService from "./coupon.service.js";

export const createCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const coupon = await couponService.createCoupon(req.body);

    return res.status(201).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

export const getCoupons = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const coupons = await couponService.getCoupons();

    return res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    next(error);
  }
};

export const getCouponById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const coupon = await couponService.getCouponById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const coupon = await couponService.deleteCoupon(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Any logged-in customer can check if a code is valid before checkout
export const validateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { code, orderSubtotal } = req.body;

    const coupon = await couponService.validateCouponForOrder(
      code,
      orderSubtotal,
    );

    return res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};