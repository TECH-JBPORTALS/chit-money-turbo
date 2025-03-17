"use server";

import { z } from "zod";
import { onboardingSchema } from "./validators";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function updateUserPrivateMetadata(
  privateMetadata: z.infer<typeof onboardingSchema>
) {
  try {
    const client = await clerkClient();
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    // const currentPrivateMetadata = await client.users.ge
    const data = await client.users.updateUserMetadata(userId, {
      privateMetadata,
    });

    return JSON.stringify(data.privateMetadata);
  } catch (e) {
    console.log("Error while updating privateMetadata", e);
  }
}
