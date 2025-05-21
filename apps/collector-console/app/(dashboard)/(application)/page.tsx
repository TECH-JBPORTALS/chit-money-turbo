import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cmt/ui/components/card";
import { Avatar, AvatarImage, AvatarFallback } from "@cmt/ui/components/avatar";
import { Progress } from "@cmt/ui/components/progress";
import { trpc } from "@/trpc/server";
import { createQueryClient } from "@/trpc/query-client";
import { Loader2Icon } from "lucide-react";
import React, { Suspense } from "react";

async function GetTotalBatchesOfOrganization() {
  const client = createQueryClient();
  const data = await client.fetchQuery(
    trpc.metrics.getTotalBatchesOfOrganization.queryOptions()
  );
  return data;
}

async function GetTotalSubscribersInInvolvedInOrganization() {
  const client = createQueryClient();
  const data = await client.fetchQuery(
    trpc.metrics.getTotalSubscribersInvolvedInOrganization.queryOptions()
  );
  return data;
}

async function GetLatestSubscribers() {
  const client = createQueryClient();
  const data = await client.fetchQuery(
    trpc.metrics.getLatestSubscribers.queryOptions()
  );
  const totalSubscribers = await client.fetchQuery(
    trpc.metrics.getTotalSubscribersInvolvedInOrganization.queryOptions()
  );
  const totalBatches = await client.fetchQuery(
    trpc.metrics.getTotalBatchesOfOrganization.queryOptions()
  );

  return (
    <React.Fragment>
      <div className="inline-flex -space-x-3">
        {data.map((sub, i) => (
          <Avatar className="border-3 border-card size-8" key={i}>
            <AvatarImage
              src={sub.user.imageUrl}
              alt={sub.user.firstName ?? ""}
            />
            <AvatarFallback>
              {sub.user.firstName?.charAt(0)}
              {sub.user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="text-muted-foreground">
        {totalSubscribers} subscribers from {totalBatches} batches
      </div>
    </React.Fragment>
  );
}

async function GetTotalPenaltyCollectedInOrganization({
  forThisMonth = false,
}: {
  forThisMonth?: boolean;
}) {
  const client = createQueryClient();
  const data = await client.fetchQuery(
    trpc.metrics.getTotalPenaltyCollectedInOrganization.queryOptions({
      forThisMonth,
    })
  );
  return data.totalPenalty.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

async function GetTotalTransactionsCountForPenalty({
  forThisMonth = false,
}: {
  forThisMonth?: boolean;
}) {
  const client = createQueryClient();
  const data = await client.fetchQuery(
    trpc.metrics.getTotalPenaltyCollectedInOrganization.queryOptions({
      forThisMonth,
    })
  );
  return (
    <div className="text-muted-foreground">
      collected from {data.totalTransaction} transactions
    </div>
  );
}

async function GetTotalCollectedPayments({
  forThisMonth = false,
}: {
  forThisMonth?: boolean;
}) {
  const client = createQueryClient();
  const data = await client.fetchQuery(
    trpc.metrics.getTotalCollectionOfOrganization.queryOptions({
      forThisMonth,
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

async function GetTotalCollectedPaymentsFooter({
  forThisMonth = false,
}: {
  forThisMonth?: boolean;
}) {
  const client = createQueryClient();
  const data = await client.fetchQuery(
    trpc.metrics.getTotalCollectionOfOrganization.queryOptions({ forThisMonth })
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
        payment pending in all active batches
      </div>
    </CardFooter>
  );
}

export default async function Page() {
  const client = createQueryClient();
  const data = await client.fetchQuery(
    trpc.collectors.getOrgInfo.queryOptions()
  );

  return (
    <div className="flex flex-col  py-8 gap-8">
      {/* Chit Fund Title */}
      <div>
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {data?.orgName}
        </h2>
        <p className="text-sm text-muted-foreground">
          All over details in this chit fund
        </p>
      </div>
      {/* Overview stat cards  grid*/}
      <div className="grid lg:grid-cols-4 xl:grid-cols-5 gap-2">
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Total Batches</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              <Suspense fallback={<Loader2Icon className="animate-spin" />}>
                <GetTotalBatchesOfOrganization />
              </Suspense>
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <Suspense fallback={<Loader2Icon className="animate-spin" />}>
              <GetLatestSubscribers />
            </Suspense>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Total Subscriber</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              <Suspense fallback={<Loader2Icon className="animate-spin" />}>
                <GetTotalSubscribersInInvolvedInOrganization />
              </Suspense>
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              Total subscribers involved in this chit fund
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Total Collection</CardDescription>
            <Suspense fallback={<Loader2Icon className="animate-spin" />}>
              <GetTotalCollectedPayments />
            </Suspense>
          </CardHeader>
          <Suspense fallback={<Loader2Icon className="animate-spin" />}>
            <GetTotalCollectedPaymentsFooter />
          </Suspense>
        </Card>

        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Total Penalty Collected</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              <Suspense fallback={<Loader2Icon className="animate-spin" />}>
                <GetTotalPenaltyCollectedInOrganization />
              </Suspense>
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <Suspense fallback={<Loader2Icon className="animate-spin" />}>
              <GetTotalTransactionsCountForPenalty />
            </Suspense>
          </CardFooter>
        </Card>
      </div>
      {/* This month details sub-title */}
      <div>
        <div className="text-lg font-semibold">This Month</div>
        <p className="text-sm text-muted-foreground">
          All over details in this chit fund for this month
        </p>
      </div>
      {/* This month stat cards grid */}
      <div className="grid lg:grid-cols-4 xl:grid-cols-5 gap-2">
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Total Collection</CardDescription>
            <Suspense fallback={<Loader2Icon className="animate-spin" />}>
              <GetTotalCollectedPayments forThisMonth />
            </Suspense>
          </CardHeader>
          <Suspense fallback={<Loader2Icon className="animate-spin" />}>
            <GetTotalCollectedPaymentsFooter forThisMonth />
          </Suspense>
        </Card>

        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Total Penalty Collected</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              <Suspense fallback={<Loader2Icon className="animate-spin" />}>
                <GetTotalPenaltyCollectedInOrganization forThisMonth />
              </Suspense>
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <Suspense fallback={<Loader2Icon className="animate-spin" />}>
              <GetTotalTransactionsCountForPenalty forThisMonth />
            </Suspense>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Pre Payments</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              2
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              pre payments from 2 batches
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Late Payments</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              10
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              late payments from 8 batches
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card min-h-44">
          <CardHeader className="relative">
            <CardDescription>On-Time Payments</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              20
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              on time payments from 9 batches
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
