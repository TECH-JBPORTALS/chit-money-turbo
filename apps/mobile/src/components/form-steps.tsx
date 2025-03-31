import React from "react";
import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

interface FormStepsContextProps {
  currentStep: number;
  next: () => void;
  prev: () => void;
  jumpTo: (step: number) => void;
  totalSteps: number;
  setTotalSteps: (totalSteps: number) => void;
  setCurrentStep: (step: number) => void;
}
const FormStepsContext = React.createContext<FormStepsContextProps | null>(
  null
);

export function FormStepsProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [totalSteps, setTotalSteps] = React.useState(0);

  const next = () =>
    setCurrentStep((prev) => (prev < totalSteps ? prev + 1 : totalSteps));
  const prev = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : 1));
  const jumpTo = (step: number) =>
    setCurrentStep(step > totalSteps ? totalSteps : step < 1 ? 1 : step);

  return (
    <FormStepsContext.Provider
      value={{
        currentStep,
        jumpTo,
        next,
        prev,
        totalSteps,
        setTotalSteps,
        setCurrentStep,
      }}
    >
      {children}
    </FormStepsContext.Provider>
  );
}

export function useFormSteps() {
  const ctx = React.useContext(FormStepsContext);
  if (!ctx)
    throw Error(
      "You likely forgot to wrap `FormStepsProvider` before using `useFormSteps`"
    );
  const { setCurrentStep, setTotalSteps, ...destructuredCtx } = ctx;
  return { ...destructuredCtx };
}

export const FormSteps = ({
  children,
  defaultStep = 1,
  onStepChange,
}: {
  children: React.ReactNode;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
}) => {
  const steps = React.Children.toArray(children);

  const ctx = React.useContext(FormStepsContext);

  if (!ctx)
    throw Error(
      "You likely forgot to wrap `FormStepsProvider` before using `useFormSteps`"
    );

  const { setCurrentStep, setTotalSteps, currentStep } = ctx;

  React.useEffect(() => {
    setTotalSteps(steps.length);
  }, [steps]);

  //Track changing of current step
  React.useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep]);

  React.useEffect(() => {
    setCurrentStep(defaultStep);
  }, []);

  return (
    <Animated.View entering={FadeIn.duration(800)} className="flex-1">
      {steps[currentStep - 1]}
    </Animated.View>
  );
};
