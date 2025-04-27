export interface StepProps<T extends Object> {
  state?: T;
  setState: (values: T) => Promise<void> | void;
}
