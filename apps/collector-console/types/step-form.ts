import { z } from "zod";

export interface StepProps<T extends Object> {
  next: () => void;
  state: T;
  setState: (key: keyof T, value: any) => void;
}

export interface StepWithPrevProps<T extends Object> extends StepProps<T> {
  prev: () => void;
}
