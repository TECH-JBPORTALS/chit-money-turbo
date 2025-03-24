"use client";
import BackButton from "@/components/back-button";
import { batchSchema } from "@/lib/validators";
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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Page() {
  const form = useForm<z.infer<typeof batchSchema>>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: "January 2024",
      number_of_months: 1,
      start_month: "Apr 2024",
      due_date: "Every Month 20th",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof batchSchema>) {
    console.log(values);
  }

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
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="number_of_months"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number Of Months</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Number of months defines number of subscribers fit into this
                  batch.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start_month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch Start Month</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  This will be considered as a start month of the batch
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start_month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch Due Date</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Based on this month penalty and payment status will be defined
                </FormDescription>
              </FormItem>
            )}
          />

          <Button>Update Details</Button>
        </form>
      </Form>
      <Separator />

      <section className="p-6 flex flex-col gap-4 bg-linear-30 from-primary/5 to-primary/10 rounded-lg border-primary border ">
        <div className="font-semibold text-primary text-accent-foreground text-lg">
          Complete the batch
        </div>
        <p className="text-sm text-muted-foreground">
          {`By completing this batch you agree that the batch details will be
          archived and read only. You can’t mark batch as completed until all
          the transaction are settled.`}
        </p>
        <Button variant={"secondary"} className="w-fit">
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
