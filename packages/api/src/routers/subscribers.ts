import {
  users,
  bankAccounts,
  contacts,
  addresses,
} from "@cmt/db/schemas/subscribers";
import { protectedProcedure } from "../trpc";
import { subscriberOnboardingSchema } from "@cmt/validators";
import { TRPCError } from "@trpc/server";
import { customAlphabet } from "nanoid";
import { clerkClient } from "@clerk/nextjs/server";

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
};
