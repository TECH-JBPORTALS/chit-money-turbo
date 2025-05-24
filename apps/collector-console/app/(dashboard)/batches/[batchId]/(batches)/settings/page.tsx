"use client";
import BackButton from "@/components/back-button";
import { batchSchema } from "@cmt/validators";
import { Button } from "@cmt/ui/components/button";
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
import { Separator } from "@cmt/ui/components/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { SpinnerPage } from "@/components/spinner-page";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@cmt/ui/components/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@cmt/ui/components/calendar";
import { cn } from "@cmt/ui/lib/utils";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cmt/ui/components/select";
import { toast } from "sonner";

export default function Page() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { batchId } = useParams<{ batchId: string }>();
  const form = useForm<z.infer<typeof batchSchema>>({
    resolver: zodResolver(batchSchema),
    async defaultValues() {
      const batch = await queryClient.fetchQuery(
        trpc.batches.getById.queryOptions({ batchId })
      );

      return {
        ...batch,
        batchId: batch?.id ?? "",
        defaultCommissionRate: batch?.defaultCommissionRate ?? 2,
        dueOn: batch?.dueOn ?? "",
        fundAmount: batch?.fundAmount ?? 0,
        name: batch?.name ?? "",
        scheme: batch?.scheme ?? 0,
        startsOn: batch?.startsOn ?? new Date(),
        batchStatus: batch?.batchStatus ?? "active",
        batchType: batch?.batchType ?? "interest",
      };
    },
  });

  const { mutateAsync: updateBatch, isPending } = useMutation(
    trpc.batches.update.mutationOptions({
      onSuccess() {
        toast.info("Batch details updated");
      },
      async onSettled() {
        //Refresh all batch details
        await queryClient.invalidateQueries(trpc.batches.getById.queryFilter());

        //new updated details
        const batch = await queryClient.fetchQuery(
          trpc.batches.getById.queryOptions({ batchId })
        );

        form.reset({
          ...batch,
          batchId: batch?.id ?? "",
          defaultCommissionRate: batch?.defaultCommissionRate ?? 2,
          dueOn: batch?.dueOn ?? "",
          fundAmount: batch?.fundAmount ?? 0,
          name: batch?.name ?? "",
          scheme: batch?.scheme ?? 0,
          startsOn: batch?.startsOn ?? new Date(),
          batchStatus: batch?.batchStatus ?? "active",
          batchType: batch?.batchType ?? "interest",
        });
      },
      onError() {
        toast.error("Something went wront, Try again");
      },
    })
  );

  async function onSubmit(values: z.infer<typeof batchSchema>) {
    await updateBatch(values);
  }

  if (form.formState.isLoading) return <SpinnerPage />;

  const formValues = form.getValues();

  return (
    <div className="flex flex-col gap-8 pr-72">
      <div className="flex items-center gap-4">
        <BackButton />
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Batch Settings
        </h4>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Give the batch a clear, memorable name — including the year at
                  the end is recommended.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fundAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Fund Amount</FormLabel>
                <FormControl>
                  <Input
                    disabled={!formValues.canUpdateFundAmount}
                    type="number"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const parsed = parseInt(raw || "0", 10); // parse to number
                      field.onChange(isNaN(parsed) ? 0 : parsed);
                    }}
                  />
                </FormControl>
                <FormMessage />
                {formValues.canUpdateFundAmount ? (
                  <FormDescription>
                    Target amount for every month
                  </FormDescription>
                ) : (
                  <FormDescription className="text-orange-500">
                    Can't update fund amount once the batch is started
                  </FormDescription>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number Of Months</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const parsed = parseInt(raw || "0", 10); // parse to number
                      field.onChange(isNaN(parsed) ? 0 : parsed);
                    }}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Changing the number of months will reset the batch. Only data
                  matching the new scheme will be kept — all existing payouts or
                  payments will be permanently deleted.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startsOn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch Start Month</FormLabel>
                <FormControl>
                  {/** TODO */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={!formValues.canUpdateStartsOn}
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
                        disabled={(date) =>
                          date.getDate() < new Date().getDate()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
                {formValues.canUpdateStartsOn ? (
                  <FormDescription>
                    This will be considered as a start month of the batch
                  </FormDescription>
                ) : (
                  <FormDescription className="text-orange-500">
                    Can't update batch starts month once the batch is started
                  </FormDescription>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueOn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch Due Date</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"1"}>Every month 1st</SelectItem>
                      <SelectItem value={"5"}>Every month 5th</SelectItem>
                      <SelectItem value={"10"}>Every month 10th</SelectItem>
                      <SelectItem value={"15"}>Every month 15th</SelectItem>
                      <SelectItem value={"20"}>Every month 20th</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Based on this month penalty and payment status will be defined
                </FormDescription>
              </FormItem>
            )}
          />

          <Button isLoading={isPending} disabled={!form.formState.isDirty}>
            Update Details
          </Button>
        </form>
      </Form>
      <Separator />

      <section className="p-6 flex flex-col gap-4 bg-linear-30 from-primary/5 to-primary/10 rounded-lg border-primary border ">
        <div className="font-semibold text-primary text-lg">
          Complete the batch
        </div>
        <p className="text-sm text-muted-foreground">
          {`By completing this batch you agree that the batch details will be
          archived and read only. You can't mark batch as completed until all
          the transaction are settled.`}
        </p>
        <Button
          disabled={!formValues.canCompleteBatch}
          variant={"default"}
          className="w-fit"
        >
          Mark as Completed
        </Button>
      </section>

      <Separator />

      <section className="p-6 flex flex-col gap-4 bg-linear-30 from-destructive/5 to-destructive/10 rounded-lg border-destructive border ">
        <div className="font-semibold text-destructive text-lg">
          Delete Batch
        </div>
        <p className="text-sm text-muted-foreground">
          {`Once you delete the batch it will cause all data lose related or associated within this batch. So be sure before continue.`}
        </p>
        <Button variant={"destructive"} className="w-fit">
          Delete Batch
        </Button>
      </section>
    </div>
  );
}
