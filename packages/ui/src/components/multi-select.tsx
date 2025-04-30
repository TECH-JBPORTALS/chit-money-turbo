"use client";

import React from "react";
import { cn } from "../lib/utils";
import Select, { useAsync } from "react-select/async";

export function MultiSelect({ ...props }: React.ComponentProps<typeof Select>) {
  return (
    <Select
      closeMenuOnSelect={false}
      isMulti
      unstyled
      classNames={{
        control: (state) =>
          cn(
            "h-10 rounded-md bg-background px-3",
            state.isFocused
              ? "border border-primary ring-2 ring-ring/25"
              : "border border-input",
            state.isDisabled && "opacity-50"
          ),
        menu: (state) =>
          cn(
            "pointer-events-auto mt-2 rounded-md border bg-popover px-2 py-3 text-popover-foreground shadow-md outline-none"
          ),
        dropdownIndicator: (state) =>
          cn(
            "cursor-pointer text-muted-foreground transition-all duration-300 hover:text-foreground",
            state.selectProps.menuIsOpen && "rotate-180"
          ),
        clearIndicator: (state) =>
          cn("cursor-pointer text-muted-foreground hover:text-foreground"),
        option: (state) =>
          cn(
            "cursor-pointer rounded-md px-3 py-2 text-sm transition-all duration-200",
            state.isFocused && "bg-accent"
          ),
        placeholder: (state) => cn("pl-2 text-sm text-muted-foreground"),
        indicatorsContainer: (state) =>
          cn("flex items-center gap-2 text-accent-foreground/80"),
        indicatorSeparator: (state) => cn("h-full w-1 bg-input"),
        valueContainer: (state) => cn("flex space-x-2"),
      }}
      {...props}
    />
  );
}

export { useAsync };
