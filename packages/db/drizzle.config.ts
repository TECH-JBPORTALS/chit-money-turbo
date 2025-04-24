import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing POSTGRES_URL");
}

const url = process.env.DATABASE_URL;

export default {
  schema: "./src/schemas/index.ts",
  dialect: "postgresql",
  dbCredentials: { url },
  casing: "snake_case",
} satisfies Config;
