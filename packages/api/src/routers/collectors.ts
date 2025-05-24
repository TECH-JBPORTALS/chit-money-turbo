import { schema } from "@cmt/db/client";
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
import { z } from "zod";
import { getClerkUser } from "../utils/clerk";

const {
  collectors,
  collectorsAddresses,
  collectorsBankAccounts,
  collectorsContacts,
} = schema;

export const collectorsRouter = {
  createProfile: protectedProcedure
    .input(onboardingSchema)
    .mutation(({ ctx, input }) =>
      // DB Transaction to prevent unsync data
      ctx.db.transaction(async (tx) => {
        const user = await ctx.clerk.users.updateUser(ctx.session.userId, {
          firstName: input.personalInfo.firstName,
          lastName: input.personalInfo.lastName,
        });

        if (!user)
          throw new TRPCError({
            message: "Couldn't able to update user profile name",
            code: "INTERNAL_SERVER_ERROR",
          });

        const collector = await tx
          .insert(collectors)
          .values({
            id: ctx.session.userId,
            ...input.documents,
            ...input.personalInfo,
            ...input.orgInfo,
          })
          .returning();

        await tx
          .insert(collectorsBankAccounts)
          .values({ ...input.bankInfo, userId: ctx.session.userId });

        await tx
          .insert(collectorsContacts)
          .values({ ...input.contactInfo, userId: ctx.session.userId });

        await tx
          .insert(collectorsAddresses)
          .values({ ...input.addressInfo, userId: ctx.session.userId });

        return collector;
      })
    ),

  /**
   * ### Get collector profile info
   * Returns the collector profile info of given collector id
   */
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const profile = await ctx.db.query.collectors.findFirst({
        where: eq(schema.collectors.id, input),
        with: {
          bankAccount: true,
          contact: true,
          address: true,
        },
      });

      if (!profile)
        throw new TRPCError({
          message: "No collector profile found",
          code: "NOT_FOUND",
        });

      const clerkUser = await getClerkUser(profile.id);

      return {
        ...clerkUser,
        ...profile,
      };
    }),

  getOrgInfo: protectedProcedure.query(async ({ ctx }) => {
    const orgInfo = await ctx.db.query.collectors.findFirst({
      columns: {
        orgName: true,
        orgCertificateKey: true,
      },
      where: eq(collectors.id, ctx.session.userId),
    });

    return orgInfo;
  }),

  getDocuments: protectedProcedure.query(async ({ ctx }) => {
    const documents = await ctx.db.query.collectors.findFirst({
      columns: {
        aadharBackFileKey: true,
        aadharFrontFileKey: true,
        orgCertificateKey: true,
      },
      where: eq(collectors.id, ctx.session.userId),
    });

    return documents;
  }),

  getPersonalInfo: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.clerk.users.getUser(ctx.session.userId);
    const collector = await ctx.db.query.collectors.findFirst({
      where: eq(collectors.id, ctx.session.userId),
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
    const contact = await ctx.db.query.collectorsContacts.findFirst({
      where: eq(collectorsContacts.userId, ctx.session.userId),
    });
    const address = await ctx.db.query.collectorsAddresses.findFirst({
      where: eq(collectorsAddresses.userId, ctx.session.userId),
    });

    return { ...contact, ...address };
  }),

  getBankAccount: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.collectorsBankAccounts.findFirst({
      where: eq(collectorsBankAccounts.userId, ctx.session.userId),
    })
  ),

  updatePersonalDetails: protectedProcedure
    .input(personalInfoSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.clerk.users.updateUser(ctx.session.userId, {
        firstName: input.firstName,
        lastName: input.lastName,
      });

      await ctx.db
        .update(collectors)
        .set(input)
        .where(eq(collectors.id, ctx.session.userId));
    }),

  updateOrg: protectedProcedure
    .input(orgInfoSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(collectors)
        .set(input)
        .where(eq(collectors.id, ctx.session.userId));
    }),

  updateDocuments: protectedProcedure
    .input(documentsSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(collectors)
        .set(input)
        .where(eq(collectors.id, ctx.session.userId));
    }),

  updateContactAddress: protectedProcedure
    .input(contactInfoSchema.and(addressInfoSchema))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(collectorsAddresses)
        .set(input)
        .where(eq(collectorsAddresses.userId, ctx.session.userId));

      await ctx.db
        .update(collectorsContacts)
        .set(input)
        .where(eq(collectorsContacts.userId, ctx.session.userId));
    }),

  updateBankAccount: protectedProcedure
    .input(bankInfoSchema)
    .mutation(async ({ ctx, input }) =>
      ctx.db
        .update(collectorsBankAccounts)
        .set(input)
        .where(eq(collectorsBankAccounts.userId, ctx.session.userId))
    ),
};
