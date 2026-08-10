import { User } from "./user.model.js";

interface ClerkUserData {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: "customer" | "admin";
}

export const createUserFromClerk = async (data: ClerkUserData) => {
  return User.create({
    clerkId: data.clerkId,
    email: data.email,
    ...(data.firstName !== undefined && { firstName: data.firstName }),
    ...(data.lastName !== undefined && { lastName: data.lastName }),
    role: data.role ?? "customer",
  });
};

export const updateUserFromClerk = async (
  clerkId: string,
  data: Partial<ClerkUserData>,
) => {
  return User.findOneAndUpdate({ clerkId }, data, {
    new: true,
    runValidators: true,
  }).lean();
};

export const deactivateUserFromClerk = async (clerkId: string) => {
  return User.findOneAndUpdate(
    { clerkId },
    { status: "inactive" },
    { new: true },
  ).lean();
};

export const getUserByClerkId = async (clerkId: string) => {
  return User.findOne({ clerkId }).lean();
};

export const getUsers = async () => {
  return User.find().sort({ createdAt: -1 }).lean();
};