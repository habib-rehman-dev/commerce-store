import { type CorsOptions } from "cors";
import { env } from "./env.js";

/*
 * CLIENT_URL can hold one origin or a comma-separated list
 * (e.g. your local dev URL + your deployed frontend URL),
 * so this works the same whether you have one frontend or several.
 */
const allowedOrigins = env.CLIENT_URL.split(",").map((origin) =>
  origin.trim(),
);

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow tools like Postman/curl that send no Origin header at all
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
