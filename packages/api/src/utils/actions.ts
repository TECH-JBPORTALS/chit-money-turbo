import { and, count, eq, exists, gt, ilike, inArray, lte, or } from "@cmt/db";
import { schema } from "@cmt/db/client";
import { AuthedContext } from "../trpc";
import { getPagination, paginateInputSchema } from "./paginate";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getQueryUserIds } from "./clerk";

export async function getSubscriberBatchesWithPagination({
  input,
  ctx,
}: {
  ctx: AuthedContext;
  input?: {
    cursor?: string;
    limit?: number;
    query?: string;
    batchStatus: "all" | "active" | "completed" | "upcoming";
  };
}) {
  const cursor = input?.cursor;
  const limit = input?.limit ?? 10;
  const query = input?.query;
  const cursorCond = cursor ? lte(schema.batches.id, cursor) : undefined;

  const statusCond = () => {
    switch (input?.batchStatus) {
      case "all":
        return undefined;

      case "active":
        return eq(schema.batches.batchStatus, "active");

      case "completed":
        return eq(schema.batches.batchStatus, "completed");

      case "upcoming":
        return gt(schema.batches.startsOn, new Date().toDateString());
    }
  };

  const items = await ctx.db.query.batches.findMany({
    limit: limit + 1,
    orderBy: ({ id }, { desc }) => [desc(id)],
    // Go down we go.. go.. with cursor of decending order page
    where: and(
      cursorCond,
      statusCond(),
      query ? ilike(schema.batches.name, `%${query}%`) : undefined,
      exists(
        ctx.db
          .select()
          .from(schema.subscribersToBatches)
          .where(
            and(
              eq(schema.subscribersToBatches.batchId, schema.batches.id),
              eq(schema.subscribersToBatches.subscriberId, ctx.session.userId)
            )
          )
      )
    ),
    with: {
      collector: true,
    },
  });

  const nextCursor = items.length === limit ? items.pop()?.id : undefined;

  return {
    nextCursor,
    items,
  };
}

const getSubscribersByBatchIdInput = paginateInputSchema.and(
  z.object({
    batchId: z.string(),
    query: z.string().optional(),
  })
);

export async function getSubscribersByBatchId({
  input,
  ctx,
}: {
  ctx: AuthedContext;
  input: z.infer<typeof getSubscribersByBatchIdInput>;
}) {
  const { pageIndex, pageSize, query } = input;
  const { offset } = getPagination(pageIndex, pageSize);

  const batch = await ctx.db.query.batches.findFirst({
    where: eq(schema.batches.id, input.batchId),
  });

  if (!batch)
    throw new TRPCError({ message: "Batch not found", code: "NOT_FOUND" });

  const userIds = await getQueryUserIds(ctx.clerk, query);

  const [subs, total] = await Promise.all([
    ctx.db.query.subscribersToBatches.findMany({
      where: and(
        eq(schema.subscribersToBatches.batchId, input.batchId),
        query
          ? or(
              inArray(schema.subscribersToBatches.subscriberId, userIds ?? []),
              ilike(schema.subscribersToBatches.chitId, `%${query}%`)
            )
          : undefined
      ),
      with: {
        subscriber: true,
        payments: true,
        payouts: true,
      },
      limit: pageSize,
      offset: !query ? offset : undefined,
      orderBy: (t, { desc }) => [desc(t.createdAt)],
    }),
    ctx.db
      .select({ count: count() })
      .from(schema.subscribersToBatches)
      .where(eq(schema.subscribersToBatches.batchId, input.batchId))
      .then((v) => v.at(0)?.count ?? 0),
  ]);

  const items = await Promise.all(
    subs.map(async (sub) => {
      const user = await ctx.clerk.users.getUser(sub.subscriberId);

      return {
        ...sub,
        subscriber: {
          ...sub.subscriber,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          primaryEmailAddress: user.primaryEmailAddress?.emailAddress,
        },
      };
    })
  );

  return { items, total, pageSize, pageIndex };
}
