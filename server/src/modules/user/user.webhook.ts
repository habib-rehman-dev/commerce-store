import type { Request, Response, NextFunction } from "express";
import { Webhook } from "svix";
import * as userService from "./user.service.js";
import { env } from "../../config/env.js";

interface ClerkEmailAddress {
  id: string;
  email_address: string;
}

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    primary_email_address_id?: string;
    email_addresses?: ClerkEmailAddress[];
    first_name?: string;
    last_name?: string;
    image_url?: string;
    has_image?: boolean; // <-- Add this
    public_metadata?: { role?: string };
  };
}

// Helper to reliably extract the primary email address
const getPrimaryEmail = (data: ClerkWebhookEvent["data"]): string => {
  if (!data.email_addresses || data.email_addresses.length === 0) return "";

  const primary = data.email_addresses.find(
    (e) => e.id === data.primary_email_address_id,
  );

  return (
    primary?.email_address ?? data.email_addresses?.[0]?.email_address ?? ""
  );
};

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

    const event = webhook.verify(req.body as Buffer, {
      "svix-id": svixId as string,
      "svix-timestamp": svixTimestamp as string,
      "svix-signature": svixSignature as string,
    }) as ClerkWebhookEvent;

    switch (event.type) {
      case "user.created": {
        const {
          id,
          first_name,
          last_name,
          image_url,
          has_image,
          public_metadata,
        } = event.data;

        const primaryEmail = getPrimaryEmail(event.data);

        await userService.createUserFromClerk({
          clerkId: id,
          email: primaryEmail,
          // Only set avatarUrl if a custom image actually exists
          avatarUrl: has_image ? (image_url ?? "") : "",
          ...(first_name !== undefined && { firstName: first_name }),
          ...(last_name !== undefined && { lastName: last_name }),
          role: public_metadata?.role === "admin" ? "admin" : "customer",
        });
        break;
      }

      case "user.updated": {
        const {
          id,
          first_name,
          last_name,
          image_url,
          has_image,
          public_metadata,
        } = event.data;

        const primaryEmail = getPrimaryEmail(event.data);

        await userService.updateUserFromClerk(id, {
          ...(primaryEmail && { email: primaryEmail }),
          // Explicitly update avatarUrl to custom image URL or empty string
          avatarUrl: has_image ? (image_url ?? "") : "",
          ...(first_name !== undefined && { firstName: first_name }),
          ...(last_name !== undefined && { lastName: last_name }),
          role: public_metadata?.role === "admin" ? "admin" : "customer",
        });
        break;
      }

      case "user.deleted": {
        await userService.deleteUserFromClerk(event.data.id);
        break;
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
