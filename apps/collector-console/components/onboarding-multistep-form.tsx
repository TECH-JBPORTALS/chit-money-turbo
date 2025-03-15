"use client";

import { Steps, StepsProvider, useSteps } from "react-step-builder";
import { PersonalInfoForm } from "./forms/personal-info-form";
import { ContactInfoForm } from "./forms/contact-info-form";
import { cn } from "@cmt/ui/lib/utils";
import { OrgInfoForm } from "./forms/org-info-form";

function OnboardingMultiStepForm() {
  const { next, prev, current, total } = useSteps();
  return (
    <div>
      <h1 className="text-xl text-center font-semibold text-muted-foreground">
        {current}/{total}
      </h1>

      <div className="flex gap-2 py-8">
        {Array.from({ length: total })
          .fill(0)
          .map((_, index) => (
            <div
              key={index + 1}
              className={cn(
                "h-1 w-full rounded-lg bg-primary/20",
                current === index + 1 && "bg-primary"
              )}
            />
          ))}
      </div>

      <Steps startsFrom={2} onStepChange={() => {}}>
        <PersonalInfoForm
          {...{ next }}
          setState={() => {}}
          state={{ date_of_birth: "", first_name: "", last_name: "" }}
        />
        <ContactInfoForm
          {...{ prev, next }}
          setState={() => {}}
          state={{
            primary_phone_number: "",
            contact_address: "",
            contact_city: "",
            contact_pincode: "",
            contact_state: "",
          }}
        />
        <OrgInfoForm
          {...{ prev, next }}
          setState={() => {}}
          state={{
            company_fullname: "",
            company_address: "",
            company_pincode: "",
            company_city: "",
            company_state: "",
          }}
        />
      </Steps>
    </div>
  );
}

export default function WithStepsProvider() {
  return (
    <StepsProvider>
      <OnboardingMultiStepForm />
    </StepsProvider>
  );
}
