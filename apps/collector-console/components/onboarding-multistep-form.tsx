"use client";

import { Steps, useSteps } from "react-step-builder";
import { cn } from "@cmt/ui/lib/utils";
import {
  BankInfoForm,
  ContactInfoForm,
  DocumentsForm,
  OrgInfoForm,
  PersonalInfoForm,
} from "./forms/onbaording-forms";
import { z } from "zod";
import { onboardingSchema } from "@/lib/validators";
import { updateUserPrivateMetadata } from "@/lib/actions";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";

export function OnboardingMultiStepForm({
  initialState,
}: {
  initialState: z.infer<typeof onboardingSchema>;
}) {
  const [hydrated, setHydrated] = useState(false);
  const { next, prev, current: currentStep, total } = useSteps();
  // Ensure the component is fully hydrated before rendering Steps
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <Loader2Icon className="animate-spin size-6 m-auto text-muted-foreground" />
    ); // Placeholder to maintain layout height
  }

  return (
    <div>
      <div className="flex justify-center py-4 gap-1 items-center">
        <Image
          alt="Chit Coin Logo"
          src={"/chit-coin.png"}
          height={52}
          width={52}
        />
        <h1 className="text-3xl font-black">Chit.Money</h1>
      </div>
      <h3 className="text-xl text-center font-semibold text-muted-foreground">
        {currentStep}/{total}
      </h3>

      <div className="flex gap-2 py-8">
        {Array.from({ length: total })
          .fill(0)
          .map((_, index) => (
            <div
              key={index + 1}
              className={cn(
                "h-1 w-full rounded-lg bg-primary/20",
                currentStep === index + 1 && "bg-primary"
              )}
            />
          ))}
      </div>

      <Steps
        startsFrom={initialState.currentStep}
        onStepChange={() => {
          //On each step update the current step
          updateUserPrivateMetadata({ ...initialState, currentStep });
        }}
      >
        <PersonalInfoForm
          {...{ next }}
          setState={(values) =>
            updateUserPrivateMetadata({ ...initialState, personalInfo: values })
          }
          state={initialState.personalInfo}
        />
        <ContactInfoForm
          {...{ prev, next }}
          setState={(values) =>
            updateUserPrivateMetadata({ ...initialState, contactInfo: values })
          }
          state={initialState.contactInfo}
        />
        <OrgInfoForm
          {...{ prev, next }}
          setState={(values) =>
            updateUserPrivateMetadata({ ...initialState, orgInfo: values })
          }
          state={initialState.orgInfo}
        />
        <BankInfoForm
          {...{ prev, next }}
          setState={(values) =>
            updateUserPrivateMetadata({ ...initialState, bankInfo: values })
          }
          state={initialState.bankInfo}
        />

        <DocumentsForm
          {...{ prev, next }}
          setState={(values) =>
            updateUserPrivateMetadata({ ...initialState, documents: values })
          }
          state={initialState.documents}
        />
      </Steps>
    </div>
  );
}
