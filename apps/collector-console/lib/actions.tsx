"use server";

import { z } from "zod";
import { onboardingSchema } from "./validators";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateOnboardingData({
  onboardingComplete = false,
  ...privateMetadata
}: z.infer<typeof onboardingSchema> & { onboardingComplete?: boolean }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      privateMetadata,
      publicMetadata: {
        onboardingComplete,
      },
    });

    revalidatePath("/onboarding");
  } catch (e) {
    console.log("Error while updating privateMetadata", e);
  }
}
