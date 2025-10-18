import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Circle } from "lucide-react";
import { ScrollArea, ScrollBar } from "@cmt/ui/components/scroll-area";
import PaymentCard from "@/app/(dashboard)/s/[subscriberId]/payment-card";
import BackButton from "@/components/back-button";
import { NavTabs } from "./nav-tabs";
import { createQueryClient } from "@/trpc/query-client";
import { trpc } from "@/trpc/server";

export default async function Layout({
  children,
  params,
  creditScore,
}: {
  children: React.ReactNode;
  creditScore: React.ReactNode;
  params: Promise<{ subscriberId: string }>;
}) {
  const client = createQueryClient();
  const { subscriberId } = await params;
  const sub = await client.fetchQuery(
    trpc.subscribers.getById.queryOptions({ subscriberId })
  );

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

      {/* Subscriber's credit score & history*/}
      {creditScore}
    </section>
  );
}
