import mongoose from "mongoose";
import { env } from "./env.js";

/*
 * Why this caching matters on Vercel:
 *
 * A serverless function can be "warm" (the same container handles
 * multiple requests back to back) or "cold" (a brand new container
 * spins up). If we called mongoose.connect() on every request with
 * no check, a warm container would try to open a NEW connection on
 * every single request, quickly exhausting MongoDB's connection
 * limit. This flag persists across warm invocations because the
 * module stays loaded in memory between them.
 */
let isConnected = false;

export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  await mongoose.connect(env.MONGODB_URI);
  isConnected = true;

  if (env.NODE_ENV !== "production") {
    console.log("MongoDB connected");
  }
};
