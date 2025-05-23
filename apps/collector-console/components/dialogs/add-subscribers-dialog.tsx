"use client";

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
  FormField,
  FormItem,
  FormMessage,
} from "@cmt/ui/components/form";
import {
  GetOptionLabel,
  GetOptionValue,
  MultiSelect,
  MultiValueProps,
  OptionProps,
  components,
} from "@cmt/ui/components/multi-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Skeleton } from "@cmt/ui/components/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@cmt/ui/components/tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";

const addSubscribersSchema = z.object({
  subIds: z
    .array(z.string())
    .min(1, "Atleast one subscriber is required move forward"),
});

type Subscriber = RouterOutputs["subscribers"]["search"][number];

export default function AddSubscribersDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const form = useForm<z.infer<typeof addSubscribersSchema>>({
    resolver: zodResolver(addSubscribersSchema),
    defaultValues: {
      subIds: [],
    },
  });

  const fetchOptions = useCallback(
    () =>
      queryClient.fetchQuery(
        trpc.subscribers.search.queryOptions(
          {
            query: debouncedQuery,
          },
          { gcTime: 0 }
        )
      ),
    [debouncedQuery]
  );

  const { batchId } = useParams<{ batchId: string }>();

  const { mutateAsync: addSubscribers, isPending } = useMutation(
    trpc.batches.addSubscriber.mutationOptions({
      async onSuccess(data) {
        await queryClient.invalidateQueries(
          trpc.batches.getSubscribers.queryFilter()
        );
        toast.success(`${data?.chitId} Chit Id's created successfully`);
      },
      onError() {
        toast.error(`Couldn't able add subscribers at this time`);
      },
    })
  );

  async function onSubmit(values: z.infer<typeof addSubscribersSchema>) {
    await Promise.all(
      values.subIds.map((subId) => addSubscribers({ batchId, subId }))
    );

    setOpen(false);
    router.refresh();
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
    <Dialog open={open} onOpenChange={setOpen}>
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
              name="subIds"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiSelect<Subscriber>
                      isMulti
                      placeholder="Search by names, subscriber ID's and email addresses"
                      loadOptions={() => fetchOptions()}
                      defaultInputValue={query}
                      onInputChange={(value, a) => {
                        setQuery(value);
                      }}
                      getOptionLabel={getOptionLabel}
                      getOptionValue={getOptionValue}
                      onChange={(newValue) => {
                        field.onChange(newValue.map((n) => n.id));
                      }}
                      components={{
                        Option,
                        LoadingMessage: () => (
                          <div className="h-full space-y-2">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <Skeleton key={i} className="h-14 w-full" />
                            ))}
                          </div>
                        ),
                        MultiValue,
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
              <Button size={"lg"} isLoading={isPending}>
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
