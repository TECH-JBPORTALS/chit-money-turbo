import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing POSTGRES_URL");
}

const url = process.env.DATABASE_URL;

export default {
  schema: ["./src/schema.ts", "./src/col.schema.ts", "./src/sub.schema.ts"],
  dialect: "postgresql",
  dbCredentials: { url },
  schemaFilter: ["collectors", "subscribers", "public"],
  casing: "snake_case",
} satisfies Config;
