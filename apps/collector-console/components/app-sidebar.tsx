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
  SidebarMenuItem,
} from "@cmt/ui/components/sidebar";
import {
  ChevronRight,
  ChevronRightIcon,
  HomeIcon,
  PlusIcon,
  UserCircleIcon,
  UsersIcon,
} from "lucide-react";
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
import CreateBatchDialog from "./dialogs/create-batch-dialog";
import {
  AppSidebarMenuButtonWithNextLink,
  AppSidebarMenuButtonWithSubMenu,
} from "./app-sidebar-menu-button";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ListBatches } from "./list-batches";
import { Suspense } from "react";
import { Skeleton } from "@cmt/ui/components/skeleton";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
    exact: true,
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

export async function AppSidebar() {
  prefetch(trpc.batches.getAll.queryOptions());

  return (
    <HydrateClient>
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
                    <AppSidebarMenuButtonWithNextLink
                      exact={item.exact}
                      href={item.url}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </AppSidebarMenuButtonWithNextLink>
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
                    <Suspense
                      fallback={Array.from({ length: 6 }).flatMap((_, i) => (
                        <Skeleton
                          key={i}
                          className="h-8 rounded-md w-full"
                          style={{ opacity: `${100 - i * 10}%` }}
                        />
                      ))}
                    >
                      <ListBatches />
                    </Suspense>
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
                  <SidebarMenu>{/** Completed batches list */}</SidebarMenu>
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
    </HydrateClient>
  );
}
