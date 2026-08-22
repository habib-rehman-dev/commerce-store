import "dotenv/config";
import app from "./index.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
};

startServer();
