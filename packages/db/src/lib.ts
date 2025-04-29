import { eq, sql } from "drizzle-orm";
import { db } from "./client";
import { batches, subscribersToBatches } from "./schema";

export async function generateChitId(batchId: string) {
  const batch = await db.query.batches.findFirst({
    where: eq(batches.id, batchId),
  });

  if (!batch) throw new Error("Batch not found");

  const subToBatch = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(subscribersToBatches)
    .where(eq(subscribersToBatches.batchId, batchId));

  const scheme = batch.scheme;
  const currentIndex = subToBatch[0]?.count ?? 1;

  return `CHIT${currentIndex.toString().padStart(scheme.toString().length, "0")}`;
}
