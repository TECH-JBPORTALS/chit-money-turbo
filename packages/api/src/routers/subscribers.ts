import { schema } from "@cmt/db/client";
import { protectedProcedure } from "../trpc";
import { subscriberOnboardingSchema } from "@cmt/validators";
import { TRPCError } from "@trpc/server";
import { eq } from "@cmt/db";
import { customAlphabet } from "nanoid";
import { clerkClient } from "@clerk/nextjs/server";

export const subscribersRouter = {
  createProfile: protectedProcedure
    .input(subscriberOnboardingSchema)
    .mutation(({ ctx, input }) =>
      // DB Transaction to prevent unsync data
      ctx.db.transaction(async (tx) => {
        const randomFaceId = customAlphabet("0123456789", 10);
        // 1. Add bank account
        const bankAccount = await tx
          .insert(schema.bankAccounts)
          .values(input.bankInfo)
          .returning();

        if (!bankAccount.at(0)?.id)
          throw new TRPCError({
            message: "Couldn't able to create bank account record",
            code: "INTERNAL_SERVER_ERROR",
          });

        // 2. Add contact
        const contact = await tx
          .insert(schema.contacts)
          .values(input.contactInfo)
          .returning();

        // 3. Add org address
        const address = await tx
          .insert(schema.addresses)
          .values(input.addressInfo)
          .returning();

        // 4. Finally: Add collector profile

        //update clerk user name
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

        const profile = await tx.insert(schema.subscribers).values({
          id: ctx.session.userId,
          ...input.documents,
          ...input.personalInfo,
          ...input.nomineeInfo,
          faceId: `SUB${randomFaceId()}`,
          bankAccountId: bankAccount.at(0)?.id,
          homeAddressId: address.at(0)?.id,
          contactId: contact.at(0)?.id,
        });

        return profile;
      })
    ),
  getOrgInfo: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.collectors.findFirst({
      columns: {
        orgName: true,
        orgCertificateKey: true,
      },
      where: eq(schema.collectors.id, ctx.session.userId),
    })
  ),
};
