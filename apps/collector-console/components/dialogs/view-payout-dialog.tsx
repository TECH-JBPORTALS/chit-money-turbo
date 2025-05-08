"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Button } from "@cmt/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@cmt/ui/components/dialog";
import { ScrollArea } from "@cmt/ui/components/scroll-area";
import { BadgeCheckIcon } from "lucide-react";
import { Badge } from "@cmt/ui/components/badge";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { SpinnerPage } from "../spinner-page";
import React from "react";
import { format, formatDistanceToNowStrict } from "date-fns";
import { cn } from "@cmt/ui/lib/utils";

export function ViewPayoutDialog({
  children,
  payoutId,
}: {
  children: React.ReactNode;
  payoutId: string;
}) {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.payouts.getById.queryOptions({ payoutId })
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className={cn(isLoading ? "hidden" : "flex")}>
          <BadgeCheckIcon
            strokeWidth={1}
            className={cn(
              "size-14 mx-auto",
              data?.payoutStatus === "disbursed"
                ? "text-primary"
                : "text-muted-foreground"
            )}
          />
          <DialogTitle
            className={cn(
              "text-center",
              data?.payoutStatus === "disbursed"
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            {data?.payoutStatus === "disbursed"
              ? "Payout Successfull"
              : data?.payoutStatus === "approved"
                ? "Payout Approved"
                : null}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <SpinnerPage />
        ) : (
          <React.Fragment>
            <div className="flex flex-col gap-3 mb-auto h-full">
              <ScrollArea className="flex-1  max-h-[450px]">
                <main className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <p className="text-sm">Payout Details</p>

                    <div className="px-3 rounded-lg bg-muted/15 space-y-4 py-5">
                      <div className="flex justify-between">
                        <div className="inline-flex gap-2">
                          <Avatar>
                            <AvatarImage
                              src={
                                data?.subscribersToBatches.subscriber.imageUrl
                              }
                            />
                            <AvatarFallback>
                              {data?.subscribersToBatches.subscriber.firstName?.charAt(
                                0
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span>
                              {data?.subscribersToBatches.subscriber.firstName}{" "}
                              {data?.subscribersToBatches.subscriber.lastName}
                            </span>
                            <p className="text-muted-foreground text-sm">
                              {data?.subscribersToBatches.chitId}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex gap-1.5 items-center">
                          Payout
                          <Badge variant={"secondary"} className="text-sm">
                            {format(data!.month, "MMM yyyy")}
                          </Badge>
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="inline-flex justify-between w-full">
                          <small className="text-muted-foreground text-sm">
                            Payment ID
                          </small>

                          <p className="text-sm text-right">
                            {data?.subscribersToBatches.chitId}
                          </p>
                        </div>
                        <div className="inline-flex justify-between w-full">
                          <small className="text-muted-foreground text-sm">
                            Last Updated
                          </small>

                          <p className="text-sm text-right">
                            {formatDistanceToNowStrict(
                              data?.updatedAt ?? data!.createdAt,
                              { addSuffix: true }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm">Summary</p>

                    <div className="px-3 rounded-lg bg-muted/15 space-y-2 py-5">
                      <div className="inline-flex justify-between w-full">
                        <small className="text-muted-foreground text-sm">
                          Payout Amount
                        </small>

                        <p className="text-sm text-right">
                          {data?.amount.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                      <div className="inline-flex justify-between w-full">
                        <small className="text-muted-foreground text-sm">
                          {`Your Commission (${data?.appliedCommissionRate}%)`}
                        </small>

                        <p className="text-sm text-destructive text-right">
                          -
                          {data?.deductions.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                      <div className="inline-flex justify-between w-full">
                        <small className="text-muted-foreground text-sm">
                          {"Total Amount"}
                        </small>

                        <p className="text-sm font-bold text-right">
                          {data?.totalAmount.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {data?.payoutStatus === "disbursed" && (
                    <div className="space-y-2">
                      <p className="text-sm">Transaction</p>

                      <div className="px-3 rounded-lg bg-muted/15 space-y-2 py-5">
                        <div className="inline-flex justify-between w-full">
                          <small className="text-muted-foreground text-sm">
                            Payout Date
                          </small>

                          <p className="text-sm text-right">
                            {format(data.disbursedAt!, "dd MMM yyyy")}
                          </p>
                        </div>
                        <div className="inline-flex justify-between w-full">
                          <small className="text-muted-foreground text-sm">
                            Payment Method
                          </small>

                          <p className="text-sm text-right uppercase">
                            {data.paymentMode}
                          </p>
                        </div>
                        {data.paymentMode === "upi/bank" && (
                          <div className="inline-flex justify-between w-full">
                            <small className="text-muted-foreground text-sm">
                              Transaction ID
                            </small>

                            <p className="text-sm text-right">
                              {data.transactionId}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </main>
              </ScrollArea>
            </div>

            <DialogFooter>
              {data?.payoutStatus === "disbursed" && (
                <Button size={"lg"} variant={"outline"}>
                  Edit Payment
                </Button>
              )}
              <DialogClose asChild>
                <Button size={"lg"}>Okay</Button>
              </DialogClose>
            </DialogFooter>
          </React.Fragment>
        )}
      </DialogContent>
    </Dialog>
  );
}
