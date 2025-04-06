export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
    };
  }

  //Not include onboarding meta data in publicMetadata so that we can get clean profile
  interface UserPrivateMetadata {
    documents: Record<string, string>;
  }
}
