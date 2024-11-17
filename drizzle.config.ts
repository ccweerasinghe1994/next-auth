import * as dotenv from "dotenv";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: ".env.local",
});

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
