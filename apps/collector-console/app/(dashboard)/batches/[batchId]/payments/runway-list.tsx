"use client";

import { RouterOutputs } from "@cmt/api";
import { Button } from "@cmt/ui/components/button";
import { cn } from "@cmt/ui/lib/utils";
import { parseAsString, useQueryState } from "nuqs";

export function RunwayList({
  runway,
}: {
  runway: RouterOutputs["payments"]["getRunway"];
}) {
  const defaultRunwayDate =
    new Date(runway.batch.startsOn) > new Date()
      ? runway.months.at(0)?.value
      : new Date().toDateString();

  const [currentRunway, setCurrentRunway] = useQueryState(
    "currentRunway",
    parseAsString
      .withDefault(defaultRunwayDate ?? new Date().toDateString())
      .withOptions({ clearOnDefault: false })
  );

  return (
    <div>
      {runway.months.map((r, i) => (
        <Button
          key={i}
          onClick={() => setCurrentRunway(r.value)}
          className={cn(
            "rounded-s-none duration-100 justify-start w-full font-normal text-foreground/50",
            r.value === currentRunway &&
              "rounded-s-none bg-accent border-l-2 text-foreground border-l-primary w-full justify-start"
          )}
          variant={"ghost"}
        >
          <b>{i + 1}.</b> {r.label}
        </Button>
      ))}
    </div>
  );
}
