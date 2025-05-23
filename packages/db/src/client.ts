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
  max: process.env.SEED_MODE ? 1 : undefined,
});

const relations = {
  ...colRelations,
  ...publicRelations,
  ...subRelations,
};

const schema = {
  ...subSchema,
  ...publicSchema,
  ...colSchema,
};

const db = drizzle(client, {
  schema: {
    ...schema,
    ...relations,
  },
  casing: "snake_case",
});

export { schema, db };
export type NeonDb = typeof db;
