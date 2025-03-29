import React from "react";
import { Stack } from "expo-router";
import { FormStepsProvider } from "~/components/form-steps";

export default function OnboaringLayout() {
  return (
    <FormStepsProvider>
      <Stack />
    </FormStepsProvider>
  );
}
