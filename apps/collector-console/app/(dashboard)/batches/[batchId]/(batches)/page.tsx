import EmptyState from "@/components/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Button } from "@cmt/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cmt/ui/components/card";
import { Progress } from "@cmt/ui/components/progress";
import { Badge } from "@cmt/ui/components/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@cmt/ui/components/tabs";
import { ArrowUpRightIcon, BadgeCheckIcon, SettingsIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@cmt/ui/components/tooltip";
import Link from "next/link";
import { ScrollArea } from "@cmt/ui/components/scroll-area";
import SearchInput from "@/components/search-input";
import { createQueryClient } from "@/trpc/query-client";
import { trpc } from "@/trpc/server";
import React, { Suspense } from "react";
import { SpinnerPage } from "@/components/spinner-page";
import { format } from "date-fns";
import { ThisMonthPayouts } from "./payments-client";

async function GetTotalCollectedPayments({
  forThisMonth = false,
  batchId,
}: {
  forThisMonth?: boolean;
  batchId: string;
}) {
  const client = createQueryClient();
  const data = await client.fetchQuery(
    trpc.metrics.getTotalCollectionOfBatch.queryOptions({
      forThisMonth,
      batchId,
    })
  );

  return (
    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
      {data.collectedAmount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      })}
    </CardTitle>
  );
}

async function GetThisMonthPayout({ batchId }: { batchId: string }) {
  const client = createQueryClient();
  const data = await client.fetchQuery(
    trpc.metrics.getThisMonthPayoutOfBatch.queryOptions({
      batchId,
    })
  );

  if (!data)
    return (
      <div className="inline-flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
          There no one approved for this month
        </p>
      </div>
    );

  return (
    <React.Fragment>
      <div className="inline-flex items-center gap-2">
        <Avatar className="border-3 border-card size-10">
          <AvatarImage
            src={data?.subscriber.imageUrl}
            alt={data?.subscriber.firstName ?? "Payout User Avatar"}
          />
          <AvatarFallback>
            {data?.subscriber.firstName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <b>
            {data?.subscriber.firstName} {data?.subscriber.lastName}
          </b>
          <p className="text-sm text-muted-foreground">
            {data?.subscriberToBatch.chitId}
          </p>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        Recieves{" "}
        {data.fundAmount.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
          notation: "compact",
        })}
      </div>
    </React.Fragment>
  );
}

async function GetThisMonthPayoutFooter({ batchId }: { batchId: string }) {
  const client = createQueryClient();
  const data = await client.fetchQuery(
    trpc.metrics.getThisMonthPayoutOfBatch.queryOptions({
      batchId,
    })
  );

  if (!data) return null;

  return (
    <CardFooter>
      <Button className="w-full" variant={"outline"}>
        <BadgeCheckIcon /> Payout
      </Button>
    </CardFooter>
  );
}

async function GetTotalCollectedPaymentsFooter({
  forThisMonth = false,
  batchId,
}: {
  forThisMonth?: boolean;
  batchId: string;
}) {
  const client = createQueryClient();
  const data = await client.fetchQuery(
    trpc.metrics.getTotalCollectionOfBatch.queryOptions({
      forThisMonth,
      batchId,
    })
  );

  const pendingAmount = data.totalAmountToBeCollected - data.collectedAmount;

  return (
    <CardFooter className="flex-col items-start gap-1 text-sm">
      <div className="w-full">
        <Progress
          value={Math.floor(
            (data.collectedAmount / data.totalAmountToBeCollected) * 100
          )}
        />
      </div>
      <div className="text-muted-foreground">
        Still{" "}
        <b>
          {pendingAmount.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          })}
        </b>{" "}
        payment pending this month
      </div>
    </CardFooter>
  );
}

async function GetFundProgress({ batchId }: { batchId: string }) {
  const client = createQueryClient();
  const data = await client.fetchQuery(
    trpc.metrics.getFundProgressOfBatch.queryOptions({
      batchId,
    })
  );

  return (
    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
      {data.completedMonths} / {data.totalMonths}
    </CardTitle>
  );
}

async function GetFundProgressFooter({ batchId }: { batchId: string }) {
  const client = createQueryClient();
  const data = await client.fetchQuery(
    trpc.metrics.getFundProgressOfBatch.queryOptions({
      batchId,
    })
  );

  return (
    <CardFooter className="flex-col items-start gap-1 text-sm">
      <div className="w-full">
        <Progress
          value={Math.floor((data.completedMonths / data.totalMonths) * 100)}
        />
      </div>
      <div className="text-muted-foreground">
        {data.completedMonths} out of {data.totalMonths} months are completed,
        still {data.totalMonths - data.completedMonths} months to go
      </div>
    </CardFooter>
  );
}

async function GetPaymentsProgress({ batchId }: { batchId: string }) {
  const client = createQueryClient();
  const data = await client.fetchQuery(
    trpc.metrics.getThisMonthPaymentsProgressOfBatch.queryOptions({
      batchId,
    })
  );

  return (
    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
      {data.paymentsDone} / {data.totalPaymentsToBeCollected}
    </CardTitle>
  );
}

async function GetPaymentsProgressFooter({ batchId }: { batchId: string }) {
  const client = createQueryClient();
  const data = await client.fetchQuery(
    trpc.metrics.getThisMonthPendingPaymentsOfBatch.queryOptions({
      batchId,
    })
  );

  return (
    <CardFooter className="flex-col items-start gap-2.5 text-sm">
      <div className="inline-flex gap-1">
        <div className="inline-flex -space-x-3">
          {data.pendingUsers.map((user) => (
            <Avatar className="border-3 border-card size-5" key={user.id}>
              <AvatarImage
                src={user.imageUrl}
                alt={user.firstName + " " + user.lastName}
              />
              <AvatarFallback>
                {user.firstName?.charAt(0) + "" + user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {data.totalPaymentsToBeCollected - data.paymentsDone} pending payments
        </span>
      </div>
      <Button variant={"outline"} className="w-full">
        View Payments
      </Button>
    </CardFooter>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) {
  const { batchId } = await params;
  const client = createQueryClient();
  const batch = await client.fetchQuery(
    trpc.batches.getById.queryOptions({ batchId })
  );

  if (!batch) throw new Error("Can't able to fetch batch data");

  return (
    <div className="flex flex-col gap-8">
      {/* Batch Title */}
      <div className="inline-flex justify-between">
        <div>
          <h2 className="scroll-m-20 pb-2 text-3xl font-bold tracking-tight first:mt-0">
            {batch.name}
          </h2>
          <div className="space-x-2">
            <Badge
              variant={"secondary"}
              className=" font-semibold rounded-full"
            >
              {batch.fundAmount.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}{" "}
              Fund Amount
            </Badge>

            <Badge
              variant={"secondary"}
              className=" font-semibold rounded-full"
            >
              {batch?.scheme} Months Fund
            </Badge>
            <Badge
              variant={"secondary"}
              className=" font-semibold rounded-full"
            >
              {Math.floor(batch.fundAmount / batch.scheme).toLocaleString(
                "en-IN",
                {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }
              )}{" "}
              / Month
            </Badge>
            <Badge
              variant={"secondary"}
              className=" font-semibold rounded-full"
            >
              {`Due ( Every Month ${batch.dueOn} )`}
            </Badge>
            <Badge
              variant={"secondary"}
              className=" font-semibold rounded-full"
            >
              {`Started on ${format(batch.startsOn, "dd, MMM yyyy")}`}
            </Badge>
          </div>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size={"icon"} asChild variant={"outline"}>
              <Link href={`/batches/${batchId}/settings`}>
                <SettingsIcon />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Batch Settings</TooltipContent>
        </Tooltip>
      </div>
      {/* Overview stat cards  grid*/}
      <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-2">
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>This Month Payments</CardDescription>
            <Suspense fallback={<SpinnerPage className="min-h-full block" />}>
              <GetPaymentsProgress batchId={batchId} />
            </Suspense>
          </CardHeader>
          <Suspense fallback={<SpinnerPage className="min-h-full block" />}>
            <GetPaymentsProgressFooter batchId={batchId} />
          </Suspense>
        </Card>
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>This Month Chit Holder</CardDescription>
            <Suspense fallback={<SpinnerPage className="min-h-full block" />}>
              <GetThisMonthPayout batchId={batchId} />
            </Suspense>
          </CardHeader>
          <Suspense fallback={<SpinnerPage className="min-h-full block" />}>
            <GetThisMonthPayoutFooter batchId={batchId} />
          </Suspense>
        </Card>

        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>{"This Month's Collection"}</CardDescription>
            <Suspense fallback={<SpinnerPage className="min-h-full block" />}>
              <GetTotalCollectedPayments batchId={batchId} forThisMonth />
            </Suspense>
          </CardHeader>
          <Suspense fallback={<SpinnerPage className="min-h-full block" />}>
            <GetTotalCollectedPaymentsFooter batchId={batchId} forThisMonth />
          </Suspense>
        </Card>

        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>{"Fund Progress"}</CardDescription>
            <Suspense fallback={<SpinnerPage className="min-h-full block" />}>
              <GetFundProgress batchId={batchId} />
            </Suspense>
          </CardHeader>
          <Suspense fallback={<SpinnerPage className="min-h-full block" />}>
            <GetFundProgressFooter batchId={batchId} />
          </Suspense>
        </Card>
      </div>

      {/* Quick Action Cards*/}
      <div className="flex gap-2 w-full">
        <Card className="h-[680px] max-h-h-[680px] min-h-h-[680px] overflow-hidden w-full gap-2">
          <CardHeader>
            <CardTitle className=" text-lg font-semibold tabular-nums">
              {"This Month's Payments"}
            </CardTitle>
            <SearchInput placeholder="Search..." className="w-full" />
          </CardHeader>
          <CardContent className="h-full max-h-full pb-16">
            <ThisMonthPayouts batchId={batchId} />
          </CardContent>
        </Card>

        <Card className="w-full h-[680px] max-h-h-[680px] min-h-h-[680px] overflow-hidden gap-2">
          <Tabs defaultValue="payouts" className="w-full h-full">
            <CardHeader>
              <TabsList className="w-full">
                <TabsTrigger value="payouts">Payouts</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="h-full max-h-full">
              <TabsContent value="payouts" className="h-full">
                <ScrollArea className="h-full pr-4 pb-8">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="border-3 border-card size-10">
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="@shadcn"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                          <b>Jhon Snow</b>
                          <p className="text-sm text-muted-foreground">
                            #738392J
                          </p>
                        </div>
                      </div>
                      <div>
                        <Badge variant={"secondary"}>1. Jan 2024</Badge>
                      </div>
                      <div>
                        <Button variant={"secondary"}>
                          <ArrowUpRightIcon /> Payout
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="requests" className="h-full">
                <div className="h-full flex items-center justify-center">
                  <EmptyState
                    title="No Requests"
                    description="Any request for payouts can be seen here"
                  />
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
