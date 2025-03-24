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

export function ViewPaymentDialog({ children }: { children: React.ReactNode }) {
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

        <div className="flex flex-col gap-3 mb-auto h-full">
          <ScrollArea className="flex-1  max-h-[450px]">
            <main className="flex flex-col gap-4">
              <div className="space-y-2">
                <p className="text-sm">Payment Details</p>

                <div className="px-3 rounded-lg bg-muted/15 space-y-4 py-5">
                  <div className="flex justify-between">
                    <div className="inline-flex gap-2">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>S</AvatarFallback>
                      </Avatar>
                      <div>
                        <span>Jhon Snow</span>
                        <p className="text-muted-foreground text-sm">
                          #CHIT001
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex gap-1.5 items-center">
                      Payment
                      <Badge variant={"secondary"} className="text-sm">
                        3. March 2024
                      </Badge>
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="inline-flex justify-between w-full">
                      <small className="text-muted-foreground text-sm">
                        Payment ID
                      </small>

                      <p className="text-sm text-right">#CHIT001</p>
                    </div>
                    <div className="inline-flex justify-between w-full">
                      <small className="text-muted-foreground text-sm">
                        Last Updated
                      </small>

                      <p className="text-sm text-right">2 hours ago</p>
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

                    <p className="text-sm text-right">₹5,000</p>
                  </div>
                  <div className="inline-flex justify-between w-full">
                    <small className="text-muted-foreground text-sm">
                      Penalty Charges
                    </small>

                    <p className="text-sm text-right">+ ₹2,000</p>
                  </div>
                  <div className="inline-flex justify-between w-full">
                    <small className="text-muted-foreground text-sm">
                      {"Total Amount"}
                    </small>

                    <p className="text-sm font-bold text-right">₹5,200</p>
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

                    <p className="text-sm text-right">12 Jan 2024</p>
                  </div>
                  <div className="inline-flex justify-between w-full">
                    <small className="text-muted-foreground text-sm">
                      Credit Score Affected
                    </small>

                    <p className="text-sm text-right text-destructive">-5</p>
                  </div>
                  <div className="inline-flex justify-between w-full">
                    <small className="text-muted-foreground text-sm">
                      Payment Method
                    </small>

                    <p className="text-sm text-right">UPI / Bank</p>
                  </div>
                  <div className="inline-flex justify-between w-full">
                    <small className="text-muted-foreground text-sm">
                      Transaction ID
                    </small>

                    <p className="text-sm text-right">KDSI910KDK292020293</p>
                  </div>
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
      </DialogContent>
    </Dialog>
  );
}
