import { clerkClient } from "@clerk/express";
import { User } from "./user.model.js";

interface ClerkUserData {
  clerkId: string;
  email: string;
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  role?: "customer" | "admin";
}

export const createUserFromClerk = async (data: ClerkUserData) => {
  return User.create({
    clerkId: data.clerkId as string,
    email: data.email as string,
    avatarUrl: data.avatarUrl as string,
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

export const deleteUserFromClerk = async (clerkId: string) => {
  return User.findOneAndDelete({ clerkId }).lean();
};
const syncUserFromClerkAPI = async (clerkId: string) => {
  try {
    const clerkUser = await clerkClient.users.getUser(clerkId);
    if (!clerkUser) return null;

    const primaryEmail =
      clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId,
      )?.emailAddress ?? "";

    const newUser = await User.create({
      clerkId: clerkUser.id,
      email: primaryEmail,
      avatarUrl: clerkUser.hasImage ? clerkUser.imageUrl : "",
      ...(clerkUser.firstName && { firstName: clerkUser.firstName }),
      ...(clerkUser.lastName && { lastName: clerkUser.lastName }),
      role: clerkUser.publicMetadata?.role === "admin" ? "admin" : "customer",
    });

    return newUser.toObject();
  } catch (error) {
    console.error("Failed to lazy sync user from Clerk API:", error);
    return null;
  }
};
export const getUserByClerkId = async (clerkId: string) => {
  let user = await User.findOne({ clerkId }).lean();

  // SAFETY NET: If webhook failed or missed execution, sync from Clerk API on the fly
  if (!user) {
    user = await syncUserFromClerkAPI(clerkId);
  }

  return user;
};

export const getUsers = async () => {
  return User.find().sort({ createdAt: -1 }).lean();
};
