import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Button } from "@cmt/ui/components/button";
import ClientTabs from "./client-tabs";
import { SignOutButton } from "@clerk/nextjs";
import { createQueryClient } from "@/trpc/query-client";
import { trpc } from "@/trpc/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = createQueryClient();
  const collector = await client.fetchQuery(
    trpc.collectors.getPersonalInfo.queryOptions()
  );

  return (
    <div className="flex flex-col gap-6 py-8 pr-20">
      {/* Header */}
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          My Profile
        </h3>
      </div>

      {/** Chit Fund Profile and Signout Row */}
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex items-center flex-row gap-2">
          <Avatar className="size-16">
            <AvatarImage src={collector.imageUrl} />
            <AvatarFallback>{collector.firstName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              {collector.firstName} {collector.lastName}
            </h4>
            <p className="text-sm text-muted-foreground">
              {collector.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>

        <SignOutButton component={"Button"}>
          <Button variant={"outline"} className="w-fit">
            Sign Out
          </Button>
        </SignOutButton>
      </div>

      {/** Sub navigation */}
      <ClientTabs />

      {children}
    </div>
  );
}
