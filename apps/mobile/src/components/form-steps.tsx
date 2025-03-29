import React from "react";
import { View } from "react-native";

interface FormStepsContextProps {
  currentStep: number;
  next: () => void;
  prev: () => void;
  jumpTo: (index: number) => void;
  totalSteps: number;
  setTotalSteps: (totalSteps: number) => void;
  setCurrentStep: (index: number) => void;
}
const FormStepsContext = React.createContext<FormStepsContextProps | null>(
  null
);

export function FormStepsProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [totalSteps, setTotalSteps] = React.useState(0);

  console.log(currentStep);

  const next = () =>
    setCurrentStep((prev) => (prev < totalSteps ? prev + 1 : totalSteps));
  const prev = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : 1));
  const jumpTo = (index: number) =>
    setCurrentStep(index > totalSteps ? totalSteps : index < 1 ? 1 : index);

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
}: {
  children: React.ReactNode;
  defaultStep?: number;
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

  React.useEffect(() => {
    setCurrentStep(defaultStep);
  }, []);

  return <View className="flex-1">{steps[currentStep - 1]}</View>;
};
