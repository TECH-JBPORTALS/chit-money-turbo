"use client";
import { Button } from "@cmt/ui/components/button";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@cmt/ui/components/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const addSubscribersSchema = z.object({
  emails: z.string().nonempty("Required"),
});

export default function AddSubscribersDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const form = useForm<z.infer<typeof addSubscribersSchema>>({
    resolver: zodResolver(addSubscribersSchema),
    defaultValues: {
      emails: "",
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
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder="Search by emails, subscriber ID’s, names to create chits fot that subscriber with default commission rate of (2%)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Adding the same subscriber more than once will create
                    multiple chits for them.
                  </FormDescription>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button size={"lg"} variant={"outline"}>
                Cancel
              </Button>
              <Button size={"lg"}>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
