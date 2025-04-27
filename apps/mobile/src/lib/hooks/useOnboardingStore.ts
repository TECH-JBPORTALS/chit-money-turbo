import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";
import { z } from "zod";
import { subscriberOnboardingSchema } from "@cmt/validators";

interface OnboardingStoreProps {
  currentStep: number;
  state: z.infer<typeof subscriberOnboardingSchema>;
  setState: (state: z.infer<typeof subscriberOnboardingSchema>) => void;
  setCurrentStep: (step: number) => void;
}

export const useOnboardingStore = create<OnboardingStoreProps>()(
  persist(
    (set) => ({
      currentStep: 1,
      setState(state) {
        set({ state });
      },
      setCurrentStep(step) {
        set({ currentStep: step });
      },
      state: {
        personalInfo: {
          firstName: "",
          lastName: "",
          dateOfBirth: "",
        },
        contactInfo: {
          primaryPhoneNumber: "",
          secondaryPhoneNumber: "",
        },
        documents: {
          aadharBackFileKey: "",
          aadharFrontFileKey: "",
          panCardNumber: "",
        },
        nomineeInfo: {
          nomineeName: "",
          nomineeRelationship: "",
        },
        addressInfo: {
          addressLine: "",
          pincode: "",
          state: "",
          city: "",
        },
        bankInfo: {
          accountNumber: "",
          confirmAccountNumber: "",
          accountHolderName: "",
          ifscCode: "",
          accountType: "savings",
          branchName: "",
          upiId: "",
          city: "",
          pincode: "",
          state: "",
        },
      },
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
