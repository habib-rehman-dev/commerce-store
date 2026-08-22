import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import * as addressService from "./address.service.js";

export const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    const address = await addressService.createAddress(userId!, req.body);

    return res.status(201).json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    const addresses = await addressService.getAddresses(userId!);

    return res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
};

export const getAddressById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    const address = await addressService.getAddressById(
      userId!,
      req.params.id  as string,
    );

    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    return res.status(200).json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    const address = await addressService.updateAddress(
      userId!,
      req.params.id as string,
      req.body,
    );

    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    return res.status(200).json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);
    const address = await addressService.deleteAddress(
      userId!,
      req.params.id as string,
    );

    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};