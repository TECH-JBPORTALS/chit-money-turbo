"use client";

import { createQueryClient } from "@/trpc/query-client";
import { useTRPC } from "@/trpc/react";
import { RouterOutputs } from "@cmt/api";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@cmt/ui/components/form";
import {
  FilterOptionOption,
  GetOptionLabel,
  GetOptionValue,
  MultiSelect,
  MultiValueProps,
  OptionProps,
  components,
} from "@cmt/ui/components/multi-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon, XCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SpinnerPage } from "../spinner-page";
import { Skeleton } from "@cmt/ui/components/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@cmt/ui/components/tooltip";

const addSubscribersSchema = z.object({
  emails: z
    .array(z.object({ id: z.string(), text: z.string() }))
    .min(1, "Atleast one subscriber is required move forward")
    .default([]),
});

type Subscriber = RouterOutputs["subscribers"]["search"][number];

export default function AddSubscribersDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const trpc = useTRPC();
  const queryClient = createQueryClient();
  const form = useForm<z.infer<typeof addSubscribersSchema>>({
    resolver: zodResolver(addSubscribersSchema),
    defaultValues: {
      emails: [],
    },
  });

  async function onSubmit(values: z.infer<typeof addSubscribersSchema>) {
    console.log(values);
  }

  const Option = (props: OptionProps<Subscriber>) => {
    return (
      <components.Option {...props}>
        <div className="flex gap-1 items-center">
          <Avatar className="size-8">
            <AvatarImage
              src={props.data.imageUrl}
              alt={props.data.firstName ?? ""}
            />
            <AvatarFallback>
              {props.data.firstName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="space-x-1.5">
              <span className="text-xs">
                {props.data.firstName} {props.data.lastName}
              </span>
              <Badge
                variant={"outline"}
                className="text-xs text-accent-foreground bg-accent"
              >
                {props.data.faceId}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {props.data.primaryEmailAddress}
            </p>
          </div>
        </div>
      </components.Option>
    );
  };

  const MultiValue = ({
    components: mvComponents,
    ...props
  }: MultiValueProps<Subscriber>) => {
    return (
      <components.MultiValue
        components={{
          ...mvComponents,
          Container: (props) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  {...props.innerProps}
                  variant={"secondary"}
                  className="text-xs shadow-md border border-border bg-secondary/50 py-0.5 my-1 rounded-full"
                >
                  <Avatar className="size-4">
                    <AvatarImage
                      src={props.data.imageUrl}
                      alt={props.data.firstName ?? ""}
                    />
                    <AvatarFallback>
                      {props.data.firstName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {props.children}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{props.data.faceId}</TooltipContent>
            </Tooltip>
          ),
          Label: (props) => (
            <>
              {props.data.firstName} {props.data.lastName}
            </>
          ),
        }}
        {...props}
      />
    );
  };

  const getOptionLabel: GetOptionLabel<Subscriber> = (option) => {
    return `${option.firstName} ${option.lastName}`;
  };

  const getOptionValue: GetOptionValue<Subscriber> = (option) => {
    return `${option.id}`;
  };

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
                    <MultiSelect
                      placeholder="Search by names, subscriber ID's and email addresses"
                      loadOptions={(query, callback) =>
                        queryClient.fetchQuery(
                          trpc.subscribers.search.queryOptions({ query })
                        )
                      }
                      getOptionLabel={getOptionLabel as any}
                      getOptionValue={getOptionValue as any}
                      components={{
                        Option: Option as any,
                        LoadingMessage: () => (
                          <div className="h-full space-y-2">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <Skeleton key={i} className="h-14 w-full" />
                            ))}
                          </div>
                        ),
                        MultiValue: MultiValue as any,
                      }}
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
