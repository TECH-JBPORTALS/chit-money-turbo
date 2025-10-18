import { RouterOutputs } from "@cmt/api";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cmt/ui/components/card";
import { cn } from "@cmt/ui/lib/utils";
import { format } from "date-fns";
import React from "react";

type PaymentCardProps =
  RouterOutputs["payments"]["getCreditScoreHistory"]["items"][number];

export default function PaymentCard({
  creditScoreAffected,
  paidOn,
  subscriptionAmount,
  subscribersToBatches: { batch },
}: PaymentCardProps) {
  return (
    <Card className="flex-row px-3 py-4 justify-between">
      <CardHeader className="w-full p-0">
        <CardTitle>{batch.name}</CardTitle>
        <CardDescription>
          {paidOn && format(paidOn, "dd MMM, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardFooter className="w-full flex flex-col items-end text-right p-0">
        <p className="text-right">
          {subscriptionAmount.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          })}
        </p>
        <span
          className={cn(
            "text-right",
            creditScoreAffected > 0 ? "text-primary" : "text-destructive"
          )}
        >
          {creditScoreAffected.toLocaleString("en-IN", {
            signDisplay: "always",
          })}
        </span>
      </CardFooter>
    </Card>
  );
}
