"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
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
  ChevronRight,
  ChevronRightIcon,
  HomeIcon,
  PlusIcon,
  UserCircleIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@cmt/ui/components/collapsible";
import { Button } from "@cmt/ui/components/button";
import { ModeToggle } from "@cmt/ui/components/theme";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@cmt/ui/components/tooltip";
import { usePathname } from "next/navigation";
import { queryClient } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { api } from "@cmt/api";
import { cn } from "@cmt/ui/lib/utils";
import CreateBatchDialog from "./dialogs/create-batch-dialog";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "All Subscribers",
    url: "/all-subscribers",
    icon: UsersIcon,
  },
  {
    title: "My Profile",
    url: "/my-profile",
    icon: UserCircleIcon,
  },
];

const batches = [
  {
    id: "dhdkd9-dkdk-ff7f9d",
    title: "Janaury 2024",
    url: "#",
  },
  {
    id: "ui23-d389fk9k-ff7f83d",
    title: "JP Nagar 2024",
    url: "#",
  },
  {
    id: "ud23-d8009k-ff7f83d",
    title: "Raguvanahalli KSIT College and Staff",
    url: "#",
  },
  {
    id: "ud289-d8009k-ff7f83d",
    title: "Native 2024",
    url: "#",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data, isLoading } = useQuery({
    queryKey: ["batches"],
    queryFn: () =>
      api.getAllBatches({ collecter_id: "bea623d0-f365-11ef-b192-525418b1" }),
  });
  return (
    <Sidebar>
      <SidebarContent className="pt-6">
        <SidebarHeader className="px-4 justify-between flex">
          <h1 className="text-xl font-semibold text-primary dark:text-foreground/70">
            Chit.Money
          </h1>
        </SidebarHeader>

        {/** Application */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={pathname === item.url} asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/** Active Semester */}
        <SidebarGroup>
          <Collapsible defaultOpen>
            <SidebarGroupLabel>
              <CollapsibleTrigger asChild>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="w-fit data-[state=open]:[&_svg]:rotate-90 mr-2 rounded-xs"
                >
                  <ChevronRightIcon />
                </Button>
              </CollapsibleTrigger>
              Active Batches
              <Tooltip>
                <CreateBatchDialog>
                  <TooltipTrigger asChild>
                    <SidebarGroupAction className="size-6 ml-auto">
                      <PlusIcon />
                    </SidebarGroupAction>
                  </TooltipTrigger>
                </CreateBatchDialog>
                <TooltipContent side="right">Create New Batch</TooltipContent>
              </Tooltip>
            </SidebarGroupLabel>
            <CollapsibleContent className="pl-2" asChild>
              <SidebarContent>
                <SidebarMenu>
                  {batches.map((batch, index) => (
                    <SidebarMenuItem key={index}>
                      <Collapsible className="group/collapsible">
                        <SidebarMenuButton
                          isActive={pathname.startsWith(`/batches/${batch.id}`)}
                          asChild
                          className={cn(
                            pathname !== `/batches/${batch.id}` &&
                              "data-[active=true]:bg-transparent data-[active=true]:[&_*]:text-primary"
                          )}
                        >
                          <Link href={`/batches/${batch.id}`}>
                            <CollapsibleTrigger asChild>
                              <Button
                                size={"icon"}
                                variant={"ghost"}
                                className="w-fit data-[state=open]:[&_svg]:rotate-90"
                              >
                                <ChevronRightIcon className="size-4" />
                              </Button>
                            </CollapsibleTrigger>
                            <BookIcon />
                            <span>{batch.title}</span>
                          </Link>
                        </SidebarMenuButton>
                        <CollapsibleContent asChild>
                          <SidebarMenuSub>
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
                                isActive={pathname.startsWith(
                                  `/batches/${batch.id}/payments`
                                )}
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
                                isActive={pathname.startsWith(
                                  `/batches/${batch.id}/payouts`
                                )}
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
                  ))}
                </SidebarMenu>
              </SidebarContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/** Completed Semester */}
        <SidebarGroup>
          <Collapsible>
            <SidebarGroupLabel>
              <CollapsibleTrigger asChild>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="w-fit mr-2 data-[state=open]:[&_svg]:rotate-90 rounded-xs group"
                >
                  <ChevronRight />
                </Button>
              </CollapsibleTrigger>
              Completed Batches
              <SidebarMenuBadge className="ml-auto px-4">3</SidebarMenuBadge>
            </SidebarGroupLabel>
            <CollapsibleContent className="pl-2" asChild>
              <SidebarContent>
                <SidebarMenu>
                  {batches.map((batch, index) => (
                    <SidebarMenuItem key={index}>
                      <Collapsible className="group/collapsible">
                        <SidebarMenuButton
                          // isActive={pathname === item.url}
                          asChild
                        >
                          <Link href={"#"}>
                            <CollapsibleTrigger asChild>
                              <Button
                                size={"icon"}
                                variant={"ghost"}
                                className="w-fit data-[state=open]:[&_svg]:rotate-90"
                              >
                                <ChevronRightIcon className="size-4" />
                              </Button>
                            </CollapsibleTrigger>
                            <BookIcon />
                            <span>{batch.title}</span>
                          </Link>
                        </SidebarMenuButton>
                        <CollapsibleContent asChild>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                // isActive={pathname === item.url}
                                asChild
                              >
                                <Link href={"#"}>
                                  <UsersIcon />
                                  <span>Subscribers</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                // isActive={pathname === item.url}
                                asChild
                              >
                                <Link href={"#"}>
                                  <ArrowDownLeftIcon />
                                  <span>Payments</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                // isActive={pathname === item.url}
                                asChild
                              >
                                <Link href={"#"}>
                                  <ArrowUpRightIcon />
                                  <span>Payouts</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroupLabel className="justify-between">
          Toggle Theme <ModeToggle />
        </SidebarGroupLabel>
      </SidebarFooter>
    </Sidebar>
  );
}
