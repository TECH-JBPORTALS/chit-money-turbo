import { LoaderCircleIcon } from "lucide-react";

export function SpinnerPage() {
  return (
    <div className="h-svh w-full flex items-center justify-center">
      <LoaderCircleIcon className="text-foreground/40 animate-spin size-9 mb-72" />
    </div>
  );
}
