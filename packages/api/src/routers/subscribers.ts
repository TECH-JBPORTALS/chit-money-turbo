import { subscribersSchema } from "@cmt/db/schema";
import { protectedProcedure } from "../trpc";
import { subscriberOnboardingSchema } from "@cmt/validators";
import { TRPCError } from "@trpc/server";
import { customAlphabet } from "nanoid";
import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "@cmt/db";

const { users, bankAccounts, contacts, addresses } = subscribersSchema;

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

        const subscriber = await tx.insert(users).values({
          id: ctx.session.userId,
          ...input.documents,
          ...input.personalInfo,
          ...input.nomineeInfo,
          faceId: `SUB${randomFaceId()}`,
        });

        await tx
          .insert(bankAccounts)
          .values({ ...input.bankInfo, userId: ctx.session.userId });

        await tx
          .insert(contacts)
          .values({ ...input.contactInfo, userId: ctx.session.userId });

        await tx
          .insert(addresses)
          .values({ ...input.addressInfo, userId: ctx.session.userId });

        return subscriber;
      })
    ),

  getPersonalDetails: protectedProcedure.query(async ({ ctx }) => {
    const client = await clerkClient();
    const user = await client.users.getUser(ctx.session.userId);
    const subscriber = await ctx.subscribersDb.query.users.findFirst({
      where: eq(users.id, ctx.session.userId),
    });

    return {
      ...subscriber,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }),
  getContactAddress: protectedProcedure.query(async ({ ctx }) => {
    const address = await ctx.subscribersDb.query.addresses.findFirst({
      where: eq(addresses.userId, ctx.session.userId),
    });
    const contact = await ctx.subscribersDb.query.contacts.findFirst({
      where: eq(contacts.userId, ctx.session.userId),
    });

    return {
      ...address,
      ...contact,
    };
  }),
};
