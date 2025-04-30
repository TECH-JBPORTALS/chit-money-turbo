import { cn } from "@cmt/ui/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import { HTMLAttributes } from "react";

export function SpinnerPage({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("h-svh w-full flex items-center justify-center", className)}
      {...props}
    >
      <LoaderCircleIcon className="text-foreground/40 animate-spin size-9 mb-72" />
    </div>
  );
}
