import type { IncomingMessage, ServerResponse } from "http";
import app from "../index.js";
import { connectDB } from "../config/db.js";

/*
 * No app.listen() here — Vercel doesn't run a persistent server.
 * Instead, it calls this exported function per incoming request.
 * We connect to the DB first (connectDB is safe to call on every
 * request thanks to the isConnected cache), then hand the
 * request/response straight to our Express app.
 */
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  await connectDB();

  // Express apps are callable as a plain (req, res) request handler
  app(req as never, res as never);
}
