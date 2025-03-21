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

const createBatchSchema = z.object({
  name: z.string().nonempty("Required"),
  number_of_months: z.number().min(1, "Required"),
  start_month: z.string().nonempty("Required"),
  due_date: z.string().nonempty("Required"),
});

export default function CreateBatchDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const form = useForm<z.infer<typeof createBatchSchema>>({
    resolver: zodResolver(createBatchSchema),
    defaultValues: {
      name: "",
      number_of_months: 1,
      start_month: "",
      due_date: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createBatchSchema>) {
    console.log(values);
  }
  return (
    <Dialog>
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
              <Button size={"lg"} type="submit">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
