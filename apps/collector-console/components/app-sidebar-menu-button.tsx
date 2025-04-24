"use client";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@cmt/ui/components/sidebar";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  BookIcon,
  ChevronRightIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@cmt/ui/components/collapsible";
import { Button } from "@cmt/ui/components/button";
import { cn } from "@cmt/ui/lib/utils";
import { usePathname } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

export function AppSidebarMenuButtonWithSubMenu(batch: {
  id: string;
  name: string;
}) {
  const pathname = usePathname();
  return (
    <SidebarMenuItem>
      <Collapsible
        defaultOpen={pathname === `/batches/${batch.id}`}
        open={pathname === `/batches/${batch.id}` ? true : undefined}
        className="group/collapsible"
      >
        <div className="flex items-center relative overflow-hidden">
          {/* Collapsible trigger outside of the navigation area */}
          <CollapsibleTrigger asChild>
            <Button
              size={"icon"}
              variant={"ghost"}
              className="w-4 data-[state=open]:[&_svg]:rotate-90 absolute left-0 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </CollapsibleTrigger>

          {/* Navigation element with padding to make room for the trigger */}
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(`/batches/${batch.id}`)}
            className={cn(
              "pl-6 w-full", // Add padding for the chevron
              pathname !== `/batches/${batch.id}` &&
                "data-[active=true]:bg-transparent data-[active=true]:[&_*]:text-primary"
            )}
          >
            <Link href={`/batches/${batch.id}`}>
              <BookIcon />
              <span>{batch.name}</span>
            </Link>
          </SidebarMenuButton>
        </div>
        <CollapsibleContent asChild>
          <SidebarMenuSub className="mx-1.5">
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                isActive={pathname.startsWith(
                  `/batches/${batch.id}/subscribers`
                )}
                asChild
              >
                <Link href={`/batches/${batch.id}/subscribers`}>
                  <UsersIcon />
                  <span>Subscribers</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                isActive={pathname.startsWith(`/batches/${batch.id}/payments`)}
                asChild
              >
                <Link href={`/batches/${batch.id}/payments`}>
                  <ArrowDownLeftIcon />
                  <span>Payments</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                isActive={pathname.startsWith(`/batches/${batch.id}/payouts`)}
                asChild
              >
                <Link href={`/batches/${batch.id}/payouts`}>
                  <ArrowUpRightIcon />
                  <span>Payouts</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

export function AppSidebarMenuButtonWithNextLink({
  children,
  href,
  exact = false,
}: {
  children: React.ReactNode;
  href: string;
  /**
   * If true, the button will be active if the pathname is exactly equal to the `href`
   * Otherwise, the button will be active if the pathname starts with the `href`
   */
  exact?: boolean;
}) {
  const pathname = usePathname();
  const trpc = useTRPC();
  const {} = useQuery(trpc.hello.sayHello.queryOptions());

  return (
    <SidebarMenuButton
      isActive={exact ? pathname === href : pathname.startsWith(href)}
      asChild
    >
      <Link href={href}>{children}</Link>
    </SidebarMenuButton>
  );
}
