"use server";

import { z } from "zod";
import { onboardingSchema } from "@cmt/validators";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateOnboardingData({
  onboardingComplete,
  ...privateMetadata
}: z.infer<typeof onboardingSchema> & { onboardingComplete?: boolean }) {
  const { userId, sessionClaims } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      privateMetadata,
      publicMetadata: {
        ...sessionClaims.metadata,
        onboardingComplete,
      },
    });

    revalidatePath("/onboarding", "layout");
  } catch (e) {
    console.log("Error while updating privateMetadata", e);
  }
}
