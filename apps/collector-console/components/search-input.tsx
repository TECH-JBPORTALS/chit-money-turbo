import { Input } from "@cmt/ui/components/input";
import { cn } from "@cmt/ui/lib/utils";
import { SearchIcon } from "lucide-react";

export default function SearchInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <div className="relative flex w-auto overflow-x-visible  items-center">
      <SearchIcon className="absolute ml-2.5 mr-2.5 size-4 text-muted-foreground" />
      <Input className={cn("ps-8", className)} {...props} />
    </div>
  );
}
