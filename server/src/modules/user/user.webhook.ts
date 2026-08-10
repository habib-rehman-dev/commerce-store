import type { Request, Response, NextFunction } from "express";
import { Webhook } from "svix";
import * as userService from "./user.service.js";
import { env } from "../../config/env.js";

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: { email_address: string }[];
    first_name?: string;
    last_name?: string;
    public_metadata?: { role?: string };
  };
}

export const handleClerkWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const svixId = req.headers["svix-id"];
    const svixTimestamp = req.headers["svix-timestamp"];
    const svixSignature = req.headers["svix-signature"];

    if (!svixId || !svixTimestamp || !svixSignature) {
      return res.status(400).json({
        success: false,
        message: "Missing svix headers",
      });
    }

    const webhook = new Webhook(env.CLERK_WEBHOOK_SECRET);

    /*
     * req.body MUST be the raw, unparsed request body (a Buffer/string)
     * for signature verification to succeed — svix hashes the exact
     * bytes Clerk sent. If express.json() already parsed this into a
     * JS object before reaching here, verify() will throw. This is
     * why the webhook route is mounted with express.raw() in app.ts,
     * BEFORE the global express.json() middleware.
     */
    const event = webhook.verify(req.body as Buffer, {
      "svix-id": svixId as string,
      "svix-timestamp": svixTimestamp as string,
      "svix-signature": svixSignature as string,
    }) as ClerkWebhookEvent;

    switch (event.type) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name, public_metadata } =
          event.data;

        await userService.createUserFromClerk({
          clerkId: id,
          email: email_addresses?.[0]?.email_address ?? "",
          ...(first_name !== undefined && { firstName: first_name }),
          ...(last_name !== undefined && { lastName: last_name }),
          role: public_metadata?.role === "admin" ? "admin" : "customer",
        });
        break;
      }

      case "user.updated": {
        const { id, email_addresses, first_name, last_name, public_metadata } =
          event.data;

        await userService.updateUserFromClerk(id, {
          ...(email_addresses?.[0]?.email_address !== undefined && {
            email: email_addresses[0].email_address,
          }),
          ...(first_name !== undefined && { firstName: first_name }),
          ...(last_name !== undefined && { lastName: last_name }),
          role: public_metadata?.role === "admin" ? "admin" : "customer",
        });
        break;
      }

      case "user.deleted": {
        await userService.deactivateUserFromClerk(event.data.id);
        break;
      }

      // Other event types (session.created, etc.) are ignored for now
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};