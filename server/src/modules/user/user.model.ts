import { Schema, model } from "mongoose";
import { type IUser } from "./user.types.js";

const userSchema = new Schema<IUser>(
  {
    // The link back to Clerk — this is how webhooks find the right doc
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    /*
     * Clerk's publicMetadata is the SOURCE OF TRUTH for role
     * (that's what requireAdmin actually checks on each request).
     * This field is a mirrored copy, useful for admin dashboards
     * that want to list/filter users without calling Clerk's API.
     */
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>("User", userSchema);