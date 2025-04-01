import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";
import { z } from "zod";
import { onboardingSchema } from "../validators";

interface OnboardingStoreProps {
  currentStep: number;
  state: z.infer<typeof onboardingSchema>;
  setState: (state: z.infer<typeof onboardingSchema>) => void;
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
          full_name: "",
          date_of_birth: "",
        },
        contactInfo: {
          primary_phone_number: "",
          alternative_phone_number: "",
        },
        documents: {
          aadhar_uri: "",
          pan_number: "",
        },
        nomineeInfo: {
          full_name: "",
          relationship: "",
        },
        addressInfo: {
          complete_address: "",
          pincode: "",
          state: "",
          city: "",
        },
        bankInfo: {
          account_number: "",
          confirm_account_number: "",
          account_holder_name: "",
          ifsc_code: "",
          account_type: "",
          branch_name: "",
          upi_id: "",
        },
      },
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
