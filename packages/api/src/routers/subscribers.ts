import { schema } from "@cmt/db/client";
import { protectedProcedure } from "../trpc";
import {
  subscriberAddressInfoSchema,
  subscriberBankInfoSchema,
  subscriberContactInfoSchema,
  subscriberDocumentsSchema,
  subscriberOnboardingSchema,
  subscriberPersonalInfoSchema,
} from "@cmt/validators";
import { TRPCError } from "@trpc/server";
import { customAlphabet } from "nanoid";
import { clerkClient } from "@clerk/nextjs/server";
import { ilike, inArray, eq, or } from "@cmt/db";
import { z } from "zod";
import { getQueryUserIds } from "../utils/clerk";

const {
  subscribers,
  subscribersAddresses,
  subscribersBankAccounts,
  subscribersContacts,
} = schema;

export const subscribersRouter = {
  createProfile: protectedProcedure
    .input(subscriberOnboardingSchema)
    .mutation(({ ctx, input }) =>
      // DB Transaction to prevent unsync data
      ctx.db.transaction(async (tx) => {
        const randomFaceId = customAlphabet("0123456789", 10);
        const client = await clerkClient();
        const user = await client.users.updateUser(ctx.session.userId, {
          firstName: input.personalInfo.firstName,
          lastName: input.personalInfo.lastName,
        });

        if (!user)
          throw new TRPCError({
            message: "Couldn't able to update user profile name",
            code: "INTERNAL_SERVER_ERROR",
          });

        const subscriber = await tx.insert(subscribers).values({
          id: ctx.session.userId,
          ...input.documents,
          ...input.personalInfo,
          ...input.nomineeInfo,
          faceId: `SUB${randomFaceId()}`,
        });

        await tx
          .insert(subscribersBankAccounts)
          .values({ ...input.bankInfo, userId: ctx.session.userId });

        await tx
          .insert(subscribersContacts)
          .values({ ...input.contactInfo, userId: ctx.session.userId });

        await tx
          .insert(subscribersAddresses)
          .values({ ...input.addressInfo, userId: ctx.session.userId });

        return subscriber;
      })
    ),

  getPersonalDetails: protectedProcedure.query(async ({ ctx }) => {
    const client = await clerkClient();
    const user = await client.users.getUser(ctx.session.userId);
    const subscriber = await ctx.db.query.subscribers.findFirst({
      where: eq(subscribers.id, ctx.session.userId),
    });

    return {
      ...subscriber,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      primaryEmailAddress: user.primaryEmailAddress,
    };
  }),

  getDocuments: protectedProcedure.query(async ({ ctx }) => {
    const documents = await ctx.db.query.subscribers.findFirst({
      columns: {
        panCardNumber: true,
        aadharBackFileKey: true,
        aadharFrontFileKey: true,
      },
      where: eq(subscribers.id, ctx.session.userId),
    });

    return documents;
  }),

  getContactAddress: protectedProcedure.query(async ({ ctx }) => {
    const address = await ctx.db.query.subscribersAddresses.findFirst({
      where: eq(subscribersAddresses.userId, ctx.session.userId),
    });
    const contact = await ctx.db.query.subscribersContacts.findFirst({
      where: eq(subscribersContacts.userId, ctx.session.userId),
    });

    return {
      ...address,
      ...contact,
    };
  }),

  getBankAccount: protectedProcedure.query(async ({ ctx }) => {
    const bankAccount = await ctx.db.query.subscribersBankAccounts.findFirst({
      where: eq(subscribersBankAccounts.userId, ctx.session.userId),
    });

    return bankAccount;
  }),

  updatePersonalDetails: protectedProcedure
    .input(subscriberPersonalInfoSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.clerk.users.updateUser(ctx.session.userId, {
        firstName: input.firstName,
        lastName: input.lastName,
      });

      await ctx.db
        .update(subscribers)
        .set(input)
        .where(eq(subscribers.id, ctx.session.userId));
    }),

  updateDocuments: protectedProcedure
    .input(subscriberDocumentsSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(subscribers)
        .set(input)
        .where(eq(subscribers.id, ctx.session.userId));
    }),
  updateContactAddress: protectedProcedure
    .input(subscriberContactInfoSchema.and(subscriberAddressInfoSchema))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(subscribersAddresses)
        .set(input)
        .where(eq(subscribersAddresses.userId, ctx.session.userId));

      await ctx.db
        .update(subscribersContacts)
        .set(input)
        .where(eq(subscribersContacts.userId, ctx.session.userId));
    }),
  updateBankAccount: protectedProcedure
    .input(subscriberBankInfoSchema)
    .mutation(async ({ ctx, input }) =>
      ctx.db
        .update(subscribersBankAccounts)
        .set(input)
        .where(eq(subscribersBankAccounts.userId, ctx.session.userId))
    ),

  search: protectedProcedure
    .input(
      z.object({
        query: z.string().trim().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query } = input;

      // Get usersId's from the clerk with matching query string
      const userIds = await getQueryUserIds(ctx.clerk, query?.trim());

      // Match with the clerk userId's in the subscribers users table
      const subs = await ctx.db.query.subscribers.findMany({
        where: query
          ? or(
              inArray(schema.subscribers.id, userIds ?? []),
              ilike(schema.subscribers.faceId, query.trim())
            )
          : undefined,
        limit: 4,
        orderBy: (t, { desc }) => [desc(t.createdAt)],
      });

      console.log(subs);
      // Re-structure the data
      const items = await Promise.all(
        subs.map(async (sub) => {
          const user = await ctx.clerk.users.getUser(sub.id);

          return {
            ...sub,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            primaryEmailAddress: user.primaryEmailAddress?.emailAddress,
          };
        })
      );

      return items;
    }),
};
