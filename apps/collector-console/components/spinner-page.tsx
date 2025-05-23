import { cn } from "@cmt/ui/lib/utils";
import { LoaderCircle } from "lucide-react";
import { HTMLAttributes } from "react";

export function SpinnerPage({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "h-full min-h-svh w-full flex items-center justify-center",
        className
      )}
      {...props}
    >
      <LoaderCircle
        strokeWidth={1.25}
        className="text-foreground/60 top-[50%] bottom-[50%] animate-spin size-8"
      />
    </div>
  );
}
