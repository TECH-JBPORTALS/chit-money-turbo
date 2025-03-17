import { z } from "zod";

export interface StepProps<T extends Object> {
  next: () => void;
  state?: T;
  setState: (values: T) => Promise<any>;
}

export interface StepWithPrevProps<T extends Object> extends StepProps<T> {
  prev: () => void;
}
