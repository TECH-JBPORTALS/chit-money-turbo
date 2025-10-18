"use client";

import { RouterOutputs } from "@cmt/api";
import { Button } from "@cmt/ui/components/button";
import { cn } from "@cmt/ui/lib/utils";
import { format, setDate, startOfToday } from "date-fns";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";

export function RunwayList({
  runway,
}: {
  runway: RouterOutputs["payments"]["getRunway"];
}) {
  const defaultBatchStartMonth = format(
    setDate(startOfToday(), parseInt(runway.batch.dueOn)),
    "yyyy-MM-dd"
  );

  const defaultRunwayDate =
    new Date(runway.batch.startsOn) > new Date()
      ? (runway.months.at(0)?.value ?? defaultBatchStartMonth)
      : defaultBatchStartMonth;

  const [currentRunway, setCurrentRunway] = useQueryState(
    "currentRunway",
    parseAsString
      .withDefault(defaultRunwayDate)
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
