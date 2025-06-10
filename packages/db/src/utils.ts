import { eq, sql } from "drizzle-orm";
import { db } from "./client";
import { batches, subscribersToBatches } from "./schema/public";

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

  return {
    chitId: `CHIT${(currentIndex + 1).toString().padStart(scheme.toString().length, "0")}`,
    batch,
  };
}

export const allowValidPhoneNumberRegex = /^[6-9]\d{9}$/;
export const onlyAlphaSpaceAllowedRegex = /^[A-Za-z\s]+$/;
