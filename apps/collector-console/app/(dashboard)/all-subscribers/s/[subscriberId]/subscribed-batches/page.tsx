import { Button } from "@cmt/ui/components/button";
import { ArrowRight } from "lucide-react";

export default function Page() {
  return (
    <>
      <div className="flex gap-2 flex-col">
        <p className="text-sm text-muted-foreground">Ongoing</p>
        <Button variant={"ghost"} className="justify-between">
          Janaury 2024 <ArrowRight />
        </Button>
        <Button variant={"ghost"} className="justify-between">
          Janaury 2024 <ArrowRight />
        </Button>
        <Button variant={"ghost"} className="justify-between">
          Janaury 2024 <ArrowRight />
        </Button>
      </div>

      <div className="flex gap-2 flex-col">
        <p className="text-sm text-muted-foreground">Completed</p>
        <Button variant={"ghost"} className="justify-between">
          Janaury 2024 <ArrowRight />
        </Button>
        <Button variant={"ghost"} className="justify-between">
          Janaury 2024 <ArrowRight />
        </Button>
        <Button variant={"ghost"} className="justify-between">
          Janaury 2024 <ArrowRight />
        </Button>
      </div>
    </>
  );
}
