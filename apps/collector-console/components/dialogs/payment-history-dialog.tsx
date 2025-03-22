"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Button } from "@cmt/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@cmt/ui/components/dialog";
import { ScrollArea } from "@cmt/ui/components/scroll-area";
import PaymentCard from "../payment-card";

export default function PaymentHistoryDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="h-fit">
          <DialogTitle>Payment History</DialogTitle>
          <DialogDescription>All payments done in this batch</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mb-auto h-full">
          <div className="inline-flex gap-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <div>
              <span>Jhon Snow</span>
              <p className="text-muted-foreground text-sm">#CHIT001</p>
            </div>
          </div>
          <ScrollArea className="flex-1  max-h-[450px]">
            <div className="flex flex-col gap-2  pb-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <PaymentCard key={index} />
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button size={"lg"} variant={"outline"} className="w-full ">
              Okay, Got it
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
