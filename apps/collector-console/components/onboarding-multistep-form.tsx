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

export function OnboardingMultiStepForm({
  initialState,
}: {
  initialState: z.infer<typeof onboardingSchema>;
}) {
  const { next, prev, current: currentStep, total } = useSteps();

  return (
    <div>
      <h1 className="text-xl text-center font-semibold text-muted-foreground">
        {currentStep}/{total}
      </h1>

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
