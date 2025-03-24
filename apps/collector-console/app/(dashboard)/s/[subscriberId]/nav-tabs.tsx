"use client";

import { Tabs, TabsList, TabsTrigger } from "@cmt/ui/components/tabs";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function NavTabs() {
  const params = useParams();
  const pathname = usePathname();

  return (
    <Tabs
      value={
        pathname === `/s/${params.subscriberId}`
          ? "general"
          : "subscribed-batches"
      }
      className="w-[400px]"
    >
      <TabsList className="grid grid-cols-2">
        <TabsTrigger asChild value="general">
          <Link replace href={`/s/${params.subscriberId}`}>
            General
          </Link>
        </TabsTrigger>
        <TabsTrigger value="subscribed-batches">
          <Link replace href={`/s/${params.subscriberId}/subscribed-batches`}>
            Subscribed Batches
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
