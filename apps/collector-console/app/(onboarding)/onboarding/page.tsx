import { OnboardingMultiStepForm } from "@/components/onboarding-multistep-form";
import { auth, clerkClient } from "@clerk/nextjs/server";

export default async function OnboardingPage() {
  const client = await clerkClient();
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized request");
  const data = await client.users.getUser(userId);
  const initialPrivateMetadata = data.privateMetadata;
  return <OnboardingMultiStepForm initialState={initialPrivateMetadata} />;
}
