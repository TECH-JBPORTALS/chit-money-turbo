import { LoaderCircleIcon } from "lucide-react";

export function SpinnerPage() {
  return (
    <div className="h-svh w-full flex items-center justify-center">
      <LoaderCircleIcon className="text-foreground/70 animate-spin h-12 mb-12" />
    </div>
  );
}
