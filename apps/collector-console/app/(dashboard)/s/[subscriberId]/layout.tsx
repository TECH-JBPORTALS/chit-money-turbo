import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Circle } from "lucide-react";
import { ScrollArea, ScrollBar } from "@cmt/ui/components/scroll-area";
import PaymentCard from "@/components/payment-card";
import BackButton from "@/components/back-button";
import { NavTabs } from "./nav-tabs";
import { createQueryClient } from "@/trpc/query-client";
import { trpc } from "@/trpc/server";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ subscriberId: string }>;
}) {
  const client = createQueryClient();
  const { subscriberId } = await params;
  const sub = await client.fetchQuery(
    trpc.subscribers.getById.queryOptions({ subscriberId })
  );

  const creditScore = 700;

  return (
    <section className="w-full h-full flex">
      <ScrollArea className="flex-1">
        <div className="flex flex-col  w-full gap-6 py-8 pr-4 pb-20">
          {/* Subscriber Header*/}
          <div className="flex items-center gap-4">
            <BackButton />
            <Avatar className="size-12 border border-border">
              <AvatarImage src={sub.imageUrl} />
              <AvatarFallback>{sub.firstName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                {sub.firstName} {sub.lastName}
              </h4>
              <p className="text-muted-foreground text-sm">
                {sub.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          {/** TODO: Tabs */}
          <NavTabs />
          {children}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <ScrollArea className="w-[384px] max-h-svh border-l  ">
        <aside className="h-full px-4 py-8 flex flex-col gap-3">
          <div>
            <p className="text-xl ">Credit Score</p>
            <p className="text-sm text-muted-foreground">
              Current credit score for this subscriber and history
            </p>
          </div>

          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
            {creditScore}
          </h1>
          <div className="flex gap-0.5">
            <div className="w-full rounded-sm bg-primary/20 h-8" />
            <div className="w-full rounded-sm bg-primary h-8" />
            <div className="w-full rounded-sm bg-destructive h-8" />
          </div>
          <div className="text-center space-x-2">
            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <span>
                <Circle className="fill-primary/20 size-2 text-transparent" />
              </span>
              23 Pre Payments
            </p>

            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <span>
                <Circle className="fill-primary size-2 text-transparent" />
              </span>
              23 On-Time Payments
            </p>

            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <span>
                <Circle className="fill-destructive size-2 text-transparent" />
              </span>
              23 Late Payments
            </p>
          </div>

          {Array.from({ length: 20 })
            .fill(0)
            .map((_, i) => (
              <PaymentCard key={i} />
            ))}
        </aside>
      </ScrollArea>
    </section>
  );
}
