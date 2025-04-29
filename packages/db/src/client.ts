import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as subSchema from "./schema/subscribers";
import * as subRelations from "./schema/subscribers/relations";
import * as colSchema from "./schema/collectors";
import * as colRelations from "./schema/collectors/relations";
import * as publicSchema from "./schema/public";
import * as publicRelations from "./schema/public/relations";

const client = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const schema = {
  ...subSchema,
  ...publicSchema,
  ...colSchema,
  ...subRelations,
  ...colRelations,
  ...publicRelations,
};

const db = drizzle(client, {
  schema,
  casing: "snake_case",
});

export { schema, db };
