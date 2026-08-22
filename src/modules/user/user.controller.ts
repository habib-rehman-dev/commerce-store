import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import * as userService from "./user.service.js";

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await userService.getUserByClerkId(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await userService.getUsers();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};