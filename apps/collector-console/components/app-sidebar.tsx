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
import { prefetch, trpc } from "@/trpc/server";

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

const batches = [
  {
    id: "dhdkd9-dkdk-ff7f9d",
    name: "Janaury 2024",
    url: "#",
  },
  {
    id: "ui23-d389fk9k-ff7f83d",
    name: "JP Nagar 2024",
    url: "#",
  },
  {
    id: "ud23-d8009k-ff7f83d",
    name: "Raguvanahalli KSIT College and Staff",
    url: "#",
  },
  {
    id: "ud289-d8009k-ff7f83d",
    name: "Native 2024",
    url: "#",
  },
];

export async function AppSidebar() {
  prefetch(trpc.hello.sayHello.queryOptions());

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
                  {batches?.map((batch) => (
                    <AppSidebarMenuButtonWithSubMenu
                      {...batch}
                      key={batch.id}
                    />
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
                  {batches?.map((batch) => (
                    <AppSidebarMenuButtonWithSubMenu
                      {...batch}
                      key={batch.id}
                    />
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
