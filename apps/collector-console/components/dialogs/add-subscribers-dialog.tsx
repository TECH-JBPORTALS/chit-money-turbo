"use client";
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
import { MultiSelect } from "@cmt/ui/components/multi-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const addSubscribersSchema = z.object({
  emails: z
    .array(z.object({ id: z.string(), text: z.string() }))
    .min(1, "Atleast one subscriber is required move forward")
    .default([]),
});

export default function AddSubscribersDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const form = useForm<z.infer<typeof addSubscribersSchema>>({
    resolver: zodResolver(addSubscribersSchema),
    defaultValues: {
      emails: [],
    },
  });

  async function onSubmit(values: z.infer<typeof addSubscribersSchema>) {
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Subscribers</DialogTitle>
          <DialogDescription>
            Adding the same subscriber more than once will create multiple chits
            for them.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {/* <Textarea
                      placeholder="Search by emails, subscriber ID’s, names to create chits fot that subscriber with default commission rate of (2%)"
                      className="resize-none min-h-32"
                      {...field}
                    /> */}
                    <MultiSelect
                      placeholder="Search by names, subscriber ID's and email addresses"
                      noOptionsMessage={() => (
                        <div className="flex flex-col items-center gap-1 py-4">
                          <InfoIcon
                            strokeWidth={1.25}
                            className="size-10 text-muted-foreground"
                          />
                          <span className="text-sm">No people</span>
                          <p className="text-xs text-muted-foreground">
                            There is nobody found
                          </p>
                        </div>
                      )}
                    />
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
              <Button size={"lg"}>Add</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
