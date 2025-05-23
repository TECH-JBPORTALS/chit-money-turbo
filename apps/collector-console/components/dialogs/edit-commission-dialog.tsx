"use client";
import { useTRPC } from "@/trpc/react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@cmt/ui/components/form";
import { Input } from "@cmt/ui/components/input";
import { RadioGroup, RadioGroupItem } from "@cmt/ui/components/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addSubscribersSchema = z.object({
  rate: z.number().min(0),
});

export default function EditCommisionsDialog({
  children,
  defaultCommisionRate,
  subscriberToBatchId,
}: {
  children: React.ReactNode;
  defaultCommisionRate: number;
  subscriberToBatchId: string;
}) {
  const form = useForm<z.infer<typeof addSubscribersSchema>>({
    resolver: zodResolver(addSubscribersSchema),
    defaultValues: {
      rate: defaultCommisionRate,
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { mutateAsync: updateCommissionRate, isPending } = useMutation(
    trpc.batches.updateCommissionRate.mutationOptions({
      onSuccess(data, variables, context) {
        toast.info("Commision Rate Updated");
      },
      async onSettled(data, error, variables, context) {
        await queryClient.invalidateQueries(
          trpc.batches.getSubscribers.queryFilter()
        );
        setOpen(false);
      },
      onError(data) {
        toast.error(data.message);
      },
    })
  );

  async function onSubmit(values: z.infer<typeof addSubscribersSchema>) {
    await updateCommissionRate({
      subscriberToBatchId,
      newCommissionRate: values.rate,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Commission Rate</DialogTitle>
          <DialogDescription>
            Changes will applied to upcoming transaction for this subscriber
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        className="md:text-4xl text-4xl h-16  text-center font-bold"
                        value={field.value || ""}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const parsed = parseInt(raw || "0", 10); // parse to number
                          field.onChange(isNaN(parsed) ? 0 : parsed);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button size={"lg"} variant={"outline"}>
                  Cancel
                </Button>
              </DialogClose>
              <Button isLoading={isPending} size={"lg"}>
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
