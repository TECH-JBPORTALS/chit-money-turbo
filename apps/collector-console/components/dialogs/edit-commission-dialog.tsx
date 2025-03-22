"use client";
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
import { RadioGroup, RadioGroupItem } from "@cmt/ui/components/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const addSubscribersSchema = z.object({
  rate: z.string().nonempty("Required"),
});

export default function EditCommisionsDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const form = useForm<z.infer<typeof addSubscribersSchema>>({
    resolver: zodResolver(addSubscribersSchema),
    defaultValues: {
      rate: "2",
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
                    <RadioGroup
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      className="flex w-full"
                    >
                      <FormItem>
                        <RadioGroupItem value="2" className="hidden" />
                        <FormLabel
                          htmlFor="rate"
                          className={
                            "border h-16 px-3 rounded-md flex items-center peer-checked:bg-primary/50 justify-center text-2xl"
                          }
                        >
                          2%
                        </FormLabel>
                      </FormItem>

                      {/* <FormItem>
                        <RadioGroupItem
                          value="3"
                          className="hidden peer/commission"
                        />
                        <FormLabel
                          className={
                            "border h-16 px-3 rounded-md flex items-center peer-[data-state=checked]:bg-primary/20 justify-center text-2xl"
                          }
                        >
                          3%
                        </FormLabel>
                      </FormItem>

                      <FormItem>
                        <RadioGroupItem
                          value="3"
                          className="hidden peer/commission"
                        />
                        <FormLabel
                          className={
                            "border h-16 px-3 rounded-md flex items-center peer-[data-state=checked]:bg-primary/20 justify-center text-2xl"
                          }
                        >
                          4%
                        </FormLabel>
                      </FormItem>

                      <FormItem>
                        <RadioGroupItem
                          value="3"
                          className="hidden peer/commission"
                        />
                        <FormLabel
                          className={
                            "border h-16 px-3 rounded-md flex items-center peer-[data-state=checked]:bg-primary/20 justify-center text-2xl"
                          }
                        >
                          5%
                        </FormLabel>
                      </FormItem> */}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button size={"lg"} variant={"outline"}>
                Cancel
              </Button>
              <Button size={"lg"}>Update</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
