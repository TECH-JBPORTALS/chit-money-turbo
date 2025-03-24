"use client";
import { StepProps } from "@/types/step-form";
import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Badge } from "@cmt/ui/components/badge";
import { Button } from "@cmt/ui/components/button";
import {
  Dialog,
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
  FormDescription,
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

const payoutDetailsForm = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  payout_date: z.string().nonempty("Required"),
});

function PayoutDetailsForm(
  props: StepProps<z.infer<typeof payoutDetailsForm>>
) {
  const form = useForm<z.infer<typeof payoutDetailsForm>>({
    resolver: zodResolver(payoutDetailsForm),
    defaultValues: props.state,
  });
  const { prev, next } = useSteps();

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
          name="payout_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payout Date</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button
            type="button"
            onClick={() => prev()}
            size={"lg"}
            variant={"outline"}
          >
            Cancel
          </Button>
          <Button type="submit" size={"lg"}>
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

const payoutSummaryForm = z.object({
  method: z.enum(["Cash", "UPI", "Cheque"]),
  transaction_id: z.string().nonempty("Required"),
});

function PayoutSummaryForm(
  props: StepProps<z.infer<typeof payoutSummaryForm>> & { amount: number }
) {
  const form = useForm<z.infer<typeof payoutSummaryForm>>({
    resolver: zodResolver(payoutSummaryForm),
    defaultValues: props.state,
  });

  const { prev } = useSteps();
  const commisonAmount = Math.floor((2 / 100) * props.amount);
  const totalAmountPayable = props.amount - commisonAmount;

  async function onSubmit(values: z.infer<typeof payoutSummaryForm>) {
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
                Payout Amount
              </small>

              <p className="text-sm text-right">₹{props.amount}</p>
            </div>
            <div className="inline-flex justify-between w-full">
              <small className="text-muted-foreground text-sm">
                Your Commision (2%)
              </small>

              <p className="text-sm text-right  text-destructive">
                - ₹{commisonAmount}
              </p>
            </div>
            <div className="inline-flex justify-between w-full">
              <small className="text-muted-foreground text-sm">
                Total amount to be payout
              </small>

              <p className="text-sm text-right">₹{totalAmountPayable}</p>
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
            Cancel
          </Button>
          <Button size={"lg"}>Complete</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export function AddPayoutDialog({ children }: { children: React.ReactNode }) {
  const { current: currentStep, total } = useSteps();
  const [globalState, setGlobalState] = useState<
    z.infer<typeof payoutDetailsForm & typeof payoutSummaryForm>
  >({ amount: 40000, method: "Cash", payout_date: "", transaction_id: "" });

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
            amount={globalState.amount}
          />
        </Steps>
      </DialogContent>
    </Dialog>
  );
}
