"use client";
import { StepProps } from "@/types/step-form";
import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Badge } from "@cmt/ui/components/badge";
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
import { Calendar } from "@cmt/ui/components/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@cmt/ui/components/form";
import { Input } from "@cmt/ui/components/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@cmt/ui/components/tabs";
import { cn } from "@cmt/ui/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Steps, useSteps } from "react-step-builder";
import { z } from "zod";
import SearchInput from "../search-input";
import { ScrollArea } from "@cmt/ui/components/scroll-area";
import { Separator } from "@cmt/ui/components/separator";
import { RouterOutputs } from "@cmt/api";
import { format, formatDate } from "date-fns";
import { payoutInsertSchema } from "@cmt/db/schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@cmt/ui/components/popover";
import { CalendarIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { toast } from "sonner";

const payoutDetailsForm = payoutInsertSchema.pick({
  amount: true,
  disbursedAt: true,
});

function PayoutDetailsForm(
  props: StepProps<z.infer<typeof payoutDetailsForm>>
) {
  const form = useForm<z.infer<typeof payoutDetailsForm>>({
    resolver: zodResolver(payoutDetailsForm),
    defaultValues: props.state,
  });
  const { next } = useSteps();

  async function onSubmit(values: z.infer<typeof payoutDetailsForm>) {
    props.setState(values);
    next();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payout Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="disbursedAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payout Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" size={"lg"} variant={"outline"}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" size={"lg"}>
            Next
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

const payoutSummaryForm = payoutInsertSchema
  .pick({
    paymentMode: true,
    transactionId: true,
  })
  .superRefine((v, ctx) => {
    if (v.paymentMode === "upi/bank" && !v.transactionId)
      ctx.addIssue({
        path: ["transactionId"],
        code: "custom",
        message: "Transation ID required for payment mode UPI/Bank",
      });
  });

function PayoutSummaryForm(
  props: StepProps<z.infer<typeof payoutSummaryForm>> & {
    amount: number;
    appliedCommissionRate: number;
    month: string;
    disbursedAt: Date;
    payoutId: string;
  }
) {
  const form = useForm<z.infer<typeof payoutSummaryForm>>({
    resolver: zodResolver(payoutSummaryForm),
    defaultValues: props.state,
  });

  const { prev } = useSteps();
  const commisonAmount = Math.floor(
    (props.appliedCommissionRate / 100) * props.amount
  );

  const totalAmountPayable = props.amount - commisonAmount;

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutateAsync: disburseAmount, isPending } = useMutation(
    trpc.payouts.disburseAmount.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(trpc.payouts.pathFilter());
        toast.info("Payout disbused");
      },
      onError: async (d, v) => {
        console.log(d.message);
        toast.error("Couldn't able to add payment at this time", {
          description: "Try again later sometime",
        });
      },
    })
  );

  async function onSubmit(values: z.infer<typeof payoutSummaryForm>) {
    await disburseAmount({ ...values, ...props });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <p className="text-sm">Summary</p>

          <div className="px-3 rounded-lg bg-muted/15 space-y-2 py-5">
            <div className="inline-flex justify-between w-full">
              <small className="text-muted-foreground text-sm">
                Payout Amount
              </small>

              <p className="text-sm text-right">
                {props.amount.toLocaleString("en-IN", {
                  currencyDisplay: "symbol",
                  style: "currency",
                  currency: "INR",
                })}
              </p>
            </div>
            <div className="inline-flex justify-between w-full">
              <small className="text-muted-foreground text-sm">
                Your Commision ({props.appliedCommissionRate}%)
              </small>

              <p className="text-sm text-right  text-destructive">
                -{" "}
                {commisonAmount.toLocaleString("en-IN", {
                  currencyDisplay: "symbol",
                  style: "currency",
                  currency: "INR",
                })}
              </p>
            </div>
            <Separator />
            <div className="inline-flex justify-between w-full">
              <small className="text-muted-foreground text-sm">
                Total amount to be payout
              </small>

              <p className="text-sm text-right">
                {totalAmountPayable.toLocaleString("en-IN", {
                  currencyDisplay: "symbol",
                  style: "currency",
                  currency: "INR",
                })}
              </p>
            </div>
          </div>
        </div>

        <FormField
          name="paymentMode"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <Tabs value={field.value} onValueChange={field.onChange}>
                <TabsList className="w-full">
                  <TabsTrigger value="cash">Cash</TabsTrigger>
                  <TabsTrigger value="upi/bank">UPI/Bank</TabsTrigger>
                  <TabsTrigger value="cheque">Cheque</TabsTrigger>
                </TabsList>
                <TabsContent
                  className="border px-3 py-5 rounded-md"
                  value="upi/bank"
                >
                  <FormField
                    control={form.control}
                    name="transactionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transactoin ID</FormLabel>
                        <FormControl>
                          <Input placeholder="XHF892KHF" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button
            size={"lg"}
            onClick={() => prev()}
            type="button"
            variant={"outline"}
          >
            Back
          </Button>
          <Button isLoading={isPending} size={"lg"}>
            Complete
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export function AddPayoutDialog({
  children,
  data,
}: {
  children: React.ReactNode;
  data: RouterOutputs["payouts"]["ofBatch"]["items"][number];
}) {
  const { current: currentStep, total } = useSteps();
  const [globalState, setGlobalState] = useState<
    z.infer<typeof payoutDetailsForm & typeof payoutSummaryForm>
  >({
    amount: data.amount,
    paymentMode: "cash",
    disbursedAt: new Date(),
    transactionId: "",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="gap-0">
        <DialogHeader className="flex flex-col items-center">
          <Avatar className="size-16">
            <AvatarImage src={data.subscriber.imageUrl} />
            <AvatarFallback>
              {data.subscriber.firstName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <DialogTitle>
            {data.subscriber.firstName} {data.subscriber.lastName}
          </DialogTitle>
          <DialogDescription>
            {data.subscribersToBatches.chitId}
          </DialogDescription>
          <span className="inline-flex gap-1.5 text-lg text-muted-foreground font-semibold">
            <Badge variant={"secondary"} className="border-primary">
              {formatDate(data.month, "MMM yyyy")}
            </Badge>
            Payout
          </span>
          <div className="flex gap-2 w-full py-8">
            {Array.from({ length: total })
              .fill(0)
              .map((_, index) => (
                <div
                  key={index + 1}
                  className={cn(
                    "h-1 w-full rounded-lg bg-primary/20",
                    currentStep === index + 1 && "bg-primary"
                  )}
                />
              ))}
          </div>
        </DialogHeader>
        <Steps>
          <PayoutDetailsForm
            state={globalState}
            setState={(state) =>
              setGlobalState((prev) => ({ ...prev, ...state }))
            }
          />
          <PayoutSummaryForm
            state={globalState}
            setState={(state) =>
              setGlobalState((prev) => ({ ...prev, ...state }))
            }
            appliedCommissionRate={data.subscribersToBatches.commissionRate}
            amount={globalState.amount}
            disbursedAt={globalState.disbursedAt}
            month={data.month}
            payoutId={data.id}
          />
        </Steps>
      </DialogContent>
    </Dialog>
  );
}

export function SelectPayoutPersonDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="gap-3">
        <DialogHeader>
          <DialogTitle>Select Subscriber</DialogTitle>
          <DialogDescription>
            All subscribers eligible for <b>3. Mar 2024</b> payout
          </DialogDescription>
          <SearchInput placeholder="Search..." className="w-full" />
        </DialogHeader>
        <ScrollArea className="flex-1 flex flex-col px-4 max-h-[450px] h-[450px]">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="inline-flex py-2  w-full mt-2 items-center justify-between"
            >
              <div className="inline-flex gap-2">
                <Avatar className="size-10 border-2">
                  <AvatarImage src="https://github.com/linear.png" />
                  <AvatarFallback>N</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-sm">Ada Shelby</p>
                  <p className="text-sm text-muted-foreground">#CHIT002</p>
                </div>
              </div>
              {/* <AddPayoutDialog> */}
              <Button variant={"secondary"}>Make Payout</Button>
              {/* </AddPayoutDialog> */}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
