import { addresses, bankAccounts, collectors, contacts } from "@cmt/db/schemas";
import { protectedProcedure } from "../trpc";
import { onboardingSchema } from "@cmt/validator";
import { TRPCError } from "@trpc/server";

export const collectorsRouter = {
  createProfile: protectedProcedure
    .input(onboardingSchema)
    .mutation(({ ctx, input }) =>
      // DB Transaction to prevent unsync data
      ctx.db.transaction(async (tx) => {
        // 1. Add bank account
        const bankAccount = await tx
          .insert(bankAccounts)
          .values(input.bankInfo)
          .returning();

        if (!bankAccount.at(0)?.id)
          throw new TRPCError({
            message: "Couldn't able to create bank account record",
            code: "INTERNAL_SERVER_ERROR",
          });

        // 2. Add contact
        const contact = await tx
          .insert(contacts)
          .values(input.contactInfo)
          .returning();

        // 3. Add org address
        const address = await tx
          .insert(addresses)
          .values(input.addressInfo)
          .returning();

        // 4. Finally: Add collector profile
        const profile = await tx.insert(collectors).values({
          id: ctx.session.userId,
          ...input.documents,
          ...input.personalInfo,
          ...input.orgInfo,
          bankAccountId: bankAccount.at(0)?.id,
          orgAddressId: address.at(0)?.id,
          contactId: contact.at(0)?.id,
        });

        return profile;
      })
    ),
};
