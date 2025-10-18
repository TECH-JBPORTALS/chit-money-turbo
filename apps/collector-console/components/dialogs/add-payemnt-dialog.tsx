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
import { Separator } from "@cmt/ui/components/separator";
import { paymentInsertSchema } from "@cmt/db/schema";
import { schema } from "@cmt/db/client";
import { format, formatDate } from "date-fns";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@cmt/ui/components/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@cmt/ui/components/calendar";
import { ClerkUserType } from "@cmt/api/utils/clerk";

const paymentDetailsForm = paymentInsertSchema
  .pick({
    subscriptionAmount: true,
    penalty: true,
    paidOn: true,
  })
  .refine((v) => v.penalty <= v.subscriptionAmount, {
    message: "Penaly can not be exceed more than subscription amount",
    path: ["penalty"],
  });

function PaymentDetailsForm(
  props: StepProps<z.infer<typeof paymentDetailsForm>>
) {
  const form = useForm<z.infer<typeof paymentDetailsForm>>({
    resolver: zodResolver(paymentDetailsForm),
    defaultValues: props.state,
  });

  const { next } = useSteps();

  async function onSubmit(values: z.infer<typeof paymentDetailsForm>) {
    await props.setState(values);
    next();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="subscriptionAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription Amount</FormLabel>
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
          name="penalty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Penalty Charges</FormLabel>
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
          name="paidOn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Date</FormLabel>
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
                      selected={field.value ?? new Date()}
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

const paymentSummaryForm = paymentInsertSchema
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

function PaymentSummaryForm(
  props: StepProps<z.infer<typeof paymentSummaryForm>> & {
    subscriptionAmount: number;
    penalty: number;
    runwayDate: string;
    subscriberToBatchId: string;
    paidOn: Date;
  }
) {
  const form = useForm<z.infer<typeof paymentSummaryForm>>({
    resolver: zodResolver(paymentSummaryForm),
    defaultValues: props.state,
  });

  const { prev } = useSteps();

  const totalAmountPayable = props.subscriptionAmount + props.penalty;

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutateAsync: createPayment, isPending } = useMutation(
    trpc.payments.create.mutationOptions({
      onSuccess: () => {
        toast.success("Payment details added");
      },
      async onSettled() {
        await queryClient.invalidateQueries(trpc.payments.pathFilter());
        await queryClient.invalidateQueries(
          trpc.metrics.getThisMonthPaymentsProgressOfBatch.queryFilter()
        );
        await queryClient.invalidateQueries(
          trpc.metrics.getTotalCollectionOfBatch.queryFilter()
        );
      },
      onError: async (d, v) => {
        console.log(d.message);
        await queryClient.invalidateQueries(trpc.payments.pathFilter());
        toast.error("Couldn't able to add payment at this time", {
          description: "Try again later sometime",
        });
      },
    })
  );

  async function onSubmit(values: z.infer<typeof paymentSummaryForm>) {
    await createPayment({
      ...values,
      ...props,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <p className="text-sm">Summary</p>

          <div className="px-3 rounded-lg bg-muted/15 space-y-2 py-5">
            <div className="inline-flex justify-between w-full">
              <small className="text-muted-foreground text-sm">
                Subscription Amount
              </small>

              <p className="text-sm text-right">
                {props.subscriptionAmount.toLocaleString("en-IN", {
                  currencyDisplay: "symbol",
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
                {props.penalty.toLocaleString("en-IN", {
                  currencyDisplay: "symbol",
                  style: "currency",
                  currency: "INR",
                })}
              </p>
            </div>
            <Separator />
            <div className="inline-flex justify-between w-full">
              <small className="text-muted-foreground text-sm">
                Total amount to be paid
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

type Payment = Partial<typeof schema.payments.$inferSelect>;

export function AddPaymentDialog({
  children,
  data,
}: {
  children: React.ReactNode;
  data: {
    payment: Payment;
    subscriberToBatchId: string;
    chitId: string;
    runwayDate: string;
    subscriber: ClerkUserType;
  };
}) {
  const { current: currentStep, total } = useSteps();

  const [globalState, setGlobalState] = useState<
    z.infer<typeof paymentDetailsForm & typeof paymentSummaryForm>
  >({
    subscriptionAmount: data.payment.subscriptionAmount ?? 0,
    penalty: data.payment.penalty ?? 0,
    paymentMode: data.payment.paymentMode ?? "cash",
    paidOn: data.payment.paidOn ?? new Date(),
    transactionId: data.payment.transactionId ?? "",
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
          <DialogDescription>{data.chitId}</DialogDescription>
          <span className="inline-flex gap-1.5 text-lg text-muted-foreground font-semibold">
            <Badge variant={"secondary"} className="border-primary">
              {formatDate(data.runwayDate, "dd MMM yyyy")}
            </Badge>
            Payment
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
          <PaymentDetailsForm
            state={globalState}
            setState={(state) =>
              setGlobalState((prev) => ({ ...prev, ...state }))
            }
          />
          <PaymentSummaryForm
            state={globalState}
            setState={(state) =>
              setGlobalState((prev) => ({ ...prev, ...state }))
            }
            subscriptionAmount={globalState.subscriptionAmount}
            penalty={globalState.penalty}
            paidOn={globalState.paidOn}
            runwayDate={data.runwayDate}
            subscriberToBatchId={data.subscriberToBatchId}
          />
        </Steps>
      </DialogContent>
    </Dialog>
  );
}
