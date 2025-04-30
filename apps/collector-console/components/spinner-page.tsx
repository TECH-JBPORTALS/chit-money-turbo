import { cn } from "@cmt/ui/lib/utils";
import { CircleDivideIcon, CircleSlash2Icon } from "lucide-react";
import { HTMLAttributes } from "react";

export function SpinnerPage({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "h-full w-full flex py-40 items-center justify-center",
        className
      )}
      {...props}
    >
      <CircleDivideIcon
        strokeWidth={1.25}
        className="text-foreground/60 animate-spin size-10"
      />
    </div>
  );
}
