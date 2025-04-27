import {
  addresses,
  bankAccounts,
  contacts,
  users,
} from "@cmt/db/schemas/collectors";
import { protectedProcedure } from "../trpc";
import { onboardingSchema } from "@cmt/validators";
import { TRPCError } from "@trpc/server";
import { eq } from "@cmt/db";
import { clerkClient } from "@clerk/nextjs/server";

export const collectorsRouter = {
  createProfile: protectedProcedure
    .input(onboardingSchema)
    .mutation(({ ctx, input }) =>
      // DB Transaction to prevent unsync data
      ctx.collectorsDb.transaction(async (tx) => {
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

        const collector = await tx
          .insert(users)
          .values({
            id: ctx.session.userId,
            ...input.documents,
            ...input.personalInfo,
            ...input.orgInfo,
          })
          .returning();

        await tx
          .insert(bankAccounts)
          .values({ ...input.bankInfo, userId: ctx.session.userId });

        await tx
          .insert(contacts)
          .values({ ...input.contactInfo, userId: ctx.session.userId });

        await tx
          .insert(addresses)
          .values({ ...input.addressInfo, userId: ctx.session.userId });

        return collector;
      })
    ),
  getOrgInfo: protectedProcedure.query(({ ctx }) =>
    ctx.collectorsDb.query.users.findFirst({
      columns: {
        orgName: true,
        orgCertificateKey: true,
      },
      where: eq(users.id, ctx.session.userId),
    })
  ),
};
