import { collectorsSchema } from "@cmt/db/schema";
import { protectedProcedure } from "../trpc";
import {
  addressInfoSchema,
  bankInfoSchema,
  contactInfoSchema,
  documentsSchema,
  onboardingSchema,
  orgInfoSchema,
  personalInfoSchema,
} from "@cmt/validators";
import { TRPCError } from "@trpc/server";
import { eq } from "@cmt/db";
import { clerkClient } from "@clerk/nextjs/server";

const { addresses, bankAccounts, contacts, users } = collectorsSchema;

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

  getOrgInfo: protectedProcedure.query(async ({ ctx }) => {
    const orgInfo = await ctx.collectorsDb.query.users.findFirst({
      columns: {
        orgName: true,
        orgCertificateKey: true,
      },
      where: eq(users.id, ctx.session.userId),
    });

    return orgInfo;
  }),

  getDocuments: protectedProcedure.query(async ({ ctx }) => {
    const documents = await ctx.collectorsDb.query.users.findFirst({
      columns: {
        aadharBackFileKey: true,
        aadharFrontFileKey: true,
        orgCertificateKey: true,
      },
      where: eq(users.id, ctx.session.userId),
    });

    return documents;
  }),

  getPersonalInfo: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.clerk.users.getUser(ctx.session.userId);
    const collector = await ctx.collectorsDb.query.users.findFirst({
      where: eq(users.id, ctx.session.userId),
    });

    return {
      ...collector,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      primaryEmailAddress: user.primaryEmailAddress,
    };
  }),

  getContactAddress: protectedProcedure.query(async ({ ctx }) => {
    const contact = await ctx.collectorsDb.query.contacts.findFirst({
      where: eq(contacts.userId, ctx.session.userId),
    });
    const address = await ctx.collectorsDb.query.addresses.findFirst({
      where: eq(addresses.userId, ctx.session.userId),
    });

    return { ...contact, ...address };
  }),

  getBankAccount: protectedProcedure.query(({ ctx }) =>
    ctx.collectorsDb.query.bankAccounts.findFirst({
      where: eq(bankAccounts.userId, ctx.session.userId),
    })
  ),

  updatePersonalDetails: protectedProcedure
    .input(personalInfoSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.clerk.users.updateUser(ctx.session.userId, {
        firstName: input.firstName,
        lastName: input.lastName,
      });

      await ctx.collectorsDb
        .update(users)
        .set(input)
        .where(eq(users.id, ctx.session.userId));
    }),

  updateOrg: protectedProcedure
    .input(orgInfoSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.collectorsDb
        .update(users)
        .set(input)
        .where(eq(users.id, ctx.session.userId));
    }),

  updateDocuments: protectedProcedure
    .input(documentsSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.collectorsDb
        .update(users)
        .set(input)
        .where(eq(users.id, ctx.session.userId));
    }),

  updateContactAddress: protectedProcedure
    .input(contactInfoSchema.and(addressInfoSchema))
    .mutation(async ({ ctx, input }) => {
      await ctx.collectorsDb
        .update(addresses)
        .set(input)
        .where(eq(addresses.userId, ctx.session.userId));

      await ctx.collectorsDb
        .update(contacts)
        .set(input)
        .where(eq(contacts.userId, ctx.session.userId));
    }),

  updateBankAccount: protectedProcedure
    .input(bankInfoSchema)
    .mutation(async ({ ctx, input }) =>
      ctx.collectorsDb
        .update(bankAccounts)
        .set(input)
        .where(eq(bankAccounts.userId, ctx.session.userId))
    ),
};
