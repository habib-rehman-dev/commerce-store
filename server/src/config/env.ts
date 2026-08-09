const requiredEnvVars = ["MONGODB_URI", "CLIENT_URL"] as const;

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: process.env.PORT ?? "5000",
  MONGODB_URI: process.env.MONGODB_URI as string,
  CLIENT_URL: process.env.CLIENT_URL as string,
};
