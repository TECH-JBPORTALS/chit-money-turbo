import { onboardingSchema } from "@/lib/validators";
import { z } from "zod";

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
    };
  }

  interface UserPrivateMetadata extends z.infer<typeof onboardingSchema> {}
}
