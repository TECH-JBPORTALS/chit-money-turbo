import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as subSchema from "./sub.schema";
import * as colSchema from "./col.schema";
import * as schema from "./schema";

const client = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({
  client,
  schema: schema,
  casing: "snake_case",
});

export const collectorsDb = drizzle({
  client,
  schema: colSchema,
  casing: "snake_case",
});

export const subscribersDb = drizzle({
  client,
  schema: subSchema,
  casing: "snake_case",
});
