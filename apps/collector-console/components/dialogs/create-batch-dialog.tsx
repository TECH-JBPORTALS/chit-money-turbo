"use client";
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
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@cmt/ui/components/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@cmt/ui/components/input";
import { Button } from "@cmt/ui/components/button";
import { batchSchema } from "@cmt/validators";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { batchInsertSchema } from "@cmt/db/schema";

export default function CreateBatchDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setOpen] = useState(false);
  const form = useForm<z.infer<typeof batchInsertSchema>>({
    resolver: zodResolver(batchInsertSchema),
    defaultValues: {
      name: "",
      scheme: 10,
      startsOn: "",
      dueOn: "",
      batchType: "interest",
      defaultCommissionRate: "2",
      fundAmount: "100000",
    },
  });
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { mutateAsync: createBatch, isPending } = useMutation(
    trpc.batches.create.mutationOptions({
      onSettled() {
        queryClient.invalidateQueries(trpc.batches.pathFilter());
      },
      onSuccess() {
        setOpen(false);
      },
      onError(error) {
        console.log(error);
      },
    })
  );

  async function onSubmit(values: z.infer<typeof batchInsertSchema>) {
    await createBatch(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Batch</DialogTitle>
          <DialogDescription>
            Start a new batch by filling below details.
          </DialogDescription>
        </DialogHeader>

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
              name="fundAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Fund Amount</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    This batch montly subscription will be calculated based
                    scheme you choose
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scheme</FormLabel>
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
              name="startsOn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Start Month</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
              name="dueOn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Due Date</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Based on this month penalty and payment status will be
                    defined
                  </FormDescription>
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button size={"lg"} type="button" variant={"outline"}>
                  Cancel
                </Button>
              </DialogClose>
              <Button isLoading={isPending} size={"lg"} type="submit">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
