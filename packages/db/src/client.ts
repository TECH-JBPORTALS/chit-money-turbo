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
  schema: {
    ...collectorsSchema,
    ...subscribersSchema,
    ...publicSchema,
  },
  casing: "snake_case",
});

export const schema = { collectorsSchema, subscribersSchema, ...publicSchema };
