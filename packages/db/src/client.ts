import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as collectorsSchema from "./schemas/collectors";
import * as publicSchema from "./schemas";
import * as subscribersSchema from "./schemas/subscribers";

const schema = {
  ...collectorsSchema,
  ...subscribersSchema,
  ...publicSchema,
};

const client = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({
  client,
  schema,
  casing: "snake_case",
});
