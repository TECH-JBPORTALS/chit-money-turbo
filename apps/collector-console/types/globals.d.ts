import { onboardingSchema } from "@cmt/validator";
import { z } from "zod";

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
    };
  }

  //Not include onboarding meta data in publicMetadata so that we can get clean profile
  interface UserPrivateMetadata extends z.infer<typeof onboardingSchema> {}
}
