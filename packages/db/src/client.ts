import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as collectorsSchema from "./schemas/collectors";
import * as publicSchema from "./schemas";
import * as subscribersSchema from "./schemas/subscribers";

const client = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({
  client,
  schema: publicSchema,
  casing: "snake_case",
});

export const collectorsDb = drizzle({
  client,
  schema: collectorsSchema,
  casing: "snake_case",
});

export const subscribersDb = drizzle({
  client,
  schema: collectorsSchema,
  casing: "snake_case",
});
