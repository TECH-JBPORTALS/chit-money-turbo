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
import SearchInput from "../search-input";
import { ScrollArea } from "@cmt/ui/components/scroll-area";
import { Separator } from "@cmt/ui/components/separator";

const paymentDetailsForm = z.object({
  subscription_amount: z.number().min(1, "Amount must be greater than 0"),
  penalty_charges: z.number().min(0, "No negative value accepted"),
  payment_date: z.string().nonempty("Required"),
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
    props.setState(values);
    next();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="subscription_amount"
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
          name="penalty_charges"
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
          name="payment_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Date</FormLabel>
              <FormControl>
                <Input {...field} />
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
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

const paymentSummaryForm = z.object({
  method: z.enum(["Cash", "UPI", "Cheque"]),
  transaction_id: z.string().nonempty("Required"),
});

function PaymentSummaryForm(
  props: StepProps<z.infer<typeof paymentSummaryForm>> & {
    subscription_amount: number;
    penalty_charges: number;
  }
) {
  const form = useForm<z.infer<typeof paymentSummaryForm>>({
    resolver: zodResolver(paymentSummaryForm),
    defaultValues: props.state,
  });

  const { prev } = useSteps();
  const totalAmountPayable = props.subscription_amount + props.penalty_charges;

  async function onSubmit(values: z.infer<typeof paymentSummaryForm>) {
    console.log(values);
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
                {props.subscription_amount.toLocaleString("en-IN", {
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
                {props.penalty_charges.toLocaleString("en-IN", {
                  currencyDisplay: "symbol",
                  style: "currency",
                  currency: "INR",
                })}
              </p>
            </div>
            <Separator />
            <div className="inline-flex justify-between w-full">
              <small className="text-muted-foreground text-sm">
                Total amount to be payment
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
          name="method"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <Tabs value={field.value} onValueChange={field.onChange}>
                <TabsList className="w-full">
                  <TabsTrigger value="Cash">Cash</TabsTrigger>
                  <TabsTrigger value="UPI">UPI/Bank</TabsTrigger>
                  <TabsTrigger value="Cheque">Cheque</TabsTrigger>
                </TabsList>
                <TabsContent
                  className="border px-3 py-5 rounded-md"
                  value="UPI"
                >
                  <FormField
                    control={form.control}
                    name="transaction_id"
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
          <Button size={"lg"}>Complete</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export function AddPaymentDialog({ children }: { children: React.ReactNode }) {
  const { current: currentStep, total } = useSteps();
  const [globalState, setGlobalState] = useState<
    z.infer<typeof paymentDetailsForm & typeof paymentSummaryForm>
  >({
    subscription_amount: 40000,
    penalty_charges: 0,
    method: "Cash",
    payment_date: "",
    transaction_id: "",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="gap-0">
        <DialogHeader className="flex flex-col items-center">
          <Avatar className="size-16">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <DialogTitle>Ada Shelby</DialogTitle>
          <DialogDescription>#CHIT00</DialogDescription>
          <span className="inline-flex gap-1.5 text-lg text-muted-foreground font-semibold">
            <Badge variant={"secondary"} className="border-primary">
              3. Mar 2004
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
            subscription_amount={globalState.subscription_amount}
            penalty_charges={globalState.penalty_charges}
          />
        </Steps>
      </DialogContent>
    </Dialog>
  );
}

export function SelectPaymentPersonDialog({
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
            All subscribers eligible for <b>3. Mar 2024</b> payment
          </DialogDescription>
          <SearchInput placeholder="Search..." className="w-full" />
        </DialogHeader>
        <ScrollArea className="flex-1 flex flex-col px-4 max-h-[450px] h-[450px]">
          {Array.from({ length: 9 }).map((_, i) => (
            <div className="inline-flex py-2  w-full mt-2 items-center justify-between">
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
              <AddPaymentDialog>
                <Button variant={"secondary"}>Make Payment</Button>
              </AddPaymentDialog>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
