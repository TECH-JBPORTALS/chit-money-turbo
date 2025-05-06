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
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { SpinnerPage } from "../spinner-page";
import React from "react";
import { formatDate, formatDistanceToNow } from "date-fns";
import { cn } from "@cmt/ui/lib/utils";

export function ViewPaymentDialog({
  children,
  paymentId,
}: {
  children: React.ReactNode;
  paymentId: string;
}) {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.payments.getById.queryOptions({ paymentId })
  );

  const subscriber = data?.subscribersToBatches.subscriber;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <BadgeCheckIcon
            strokeWidth={1}
            className="text-primary size-14 mx-auto"
          />
          <DialogTitle className="text-center text-primary">
            Payment Successfull
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
                    <p className="text-sm">Payment Details</p>

                    <div className="px-3 rounded-lg bg-muted/15 space-y-4 py-5">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={subscriber?.imageUrl} />
                            <AvatarFallback>
                              {subscriber?.firstName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span>
                              {subscriber?.firstName} {subscriber?.lastName}
                            </span>
                            <p className="text-muted-foreground text-sm">
                              {data?.subscribersToBatches.chitId}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex gap-1.5 items-center">
                          Payment
                          <Badge variant={"secondary"} className="text-sm">
                            {formatDate(new Date(data!.runwayDate), "MMM yyyy")}
                          </Badge>
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="inline-flex justify-between w-full">
                          <small className="text-muted-foreground text-sm">
                            Payment ID
                          </small>

                          <p className="text-sm text-right">{data?.id}</p>
                        </div>
                        <div className="inline-flex justify-between w-full">
                          <small className="text-muted-foreground text-sm">
                            Last Updated
                          </small>

                          <p className="text-sm text-right">
                            {formatDistanceToNow(
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
                          Subscription Amount
                        </small>

                        <p className="text-sm text-right">
                          {data?.subscriptionAmount.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </p>
                      </div>
                      <div className="inline-flex justify-between w-full">
                        <small className="text-muted-foreground text-sm">
                          Penalty Charges
                        </small>

                        <p className="text-sm text-right">
                          {data?.penalty.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                            signDisplay: "exceptZero",
                            currencyDisplay: "narrowSymbol",
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
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm">Transaction</p>

                    <div className="px-3 rounded-lg bg-muted/15 space-y-2 py-5">
                      <div className="inline-flex justify-between w-full">
                        <small className="text-muted-foreground text-sm">
                          Payment Date
                        </small>

                        <p className="text-sm text-right">
                          {formatDate(new Date(data!.paidOn), "dd MMM yyyy")}
                        </p>
                      </div>
                      <div className="inline-flex justify-between w-full">
                        <small className="text-muted-foreground text-sm">
                          Credit Score Affected
                        </small>

                        <p
                          className={cn(
                            "text-sm text-right text-muted-foreground",
                            data!.creditScoreAffected > 0
                              ? "text-primary"
                              : "text-destructive"
                          )}
                        >
                          {data?.creditScoreAffected !== 0
                            ? data?.creditScoreAffected.toLocaleString(
                                "en-IN",
                                {
                                  signDisplay: "exceptZero",
                                }
                              )
                            : "NONE"}
                        </p>
                      </div>
                      <div className="inline-flex justify-between w-full">
                        <small className="text-muted-foreground text-sm">
                          Payment Method
                        </small>

                        <p className="text-sm text-right uppercase">
                          {data?.paymentMode}
                        </p>
                      </div>

                      {data?.paymentMode === "upi/bank" && (
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
                </main>
              </ScrollArea>
            </div>

            <DialogFooter>
              <Button size={"lg"} variant={"outline"}>
                Edit Payment
              </Button>
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
