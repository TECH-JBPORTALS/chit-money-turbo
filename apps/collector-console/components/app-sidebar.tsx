import {
  Sidebar,
  SidebarContent,
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
  ChevronDown,
  ChevronDownIcon,
  ChevronRight,
  HomeIcon,
  PlusIcon,
  UserCircleIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@cmt/ui/components/collapsible";
import { Button } from "@cmt/ui/components/button";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "All Subscribers",
    url: "#",
    icon: UsersIcon,
  },
  {
    title: "My Profile",
    url: "#",
    icon: UserCircleIcon,
  },
];

const batches = [
  {
    title: "Janaury 2024",
    url: "#",
  },
  {
    title: "JP Nagar 2024",
    url: "#",
  },
  {
    title: "Raguvanahalli KSIT College and Staff",
    url: "#",
  },
  {
    title: "Native 2024",
    url: "#",
  },
];

export function AppSidebar() {
  // const pathname = usePathname();
  return (
    <Sidebar className="pt-6">
      <SidebarContent>
        <SidebarHeader className="px-4">
          <h1 className="text-xl font-bold text-primary dark:text-foreground">
            Chit.Money
          </h1>
        </SidebarHeader>

        {/** Application */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    // isActive={pathname === item.url}
                    asChild
                  >
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
                  className="w-fit mr-2 rounded-xs group"
                >
                  <ChevronRight />
                </Button>
              </CollapsibleTrigger>
              ACTIVE BATCHES{" "}
              <SidebarGroupAction className="size-6 ml-auto">
                <PlusIcon />
              </SidebarGroupAction>
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
                                className="w-fit group"
                              >
                                <ChevronDownIcon className="size-4 group-[data-state=open]:rotate-180 group-[data-state=closed]:rotate-90" />
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

        {/** Completed Semester */}
        <SidebarGroup>
          <Collapsible defaultOpen>
            <SidebarGroupLabel>
              <CollapsibleTrigger asChild>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="w-fit mr-2 rounded-xs group"
                >
                  <ChevronRight />
                </Button>
              </CollapsibleTrigger>
              COMPLETED BATCHES{" "}
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
                                className="w-fit group"
                              >
                                <ChevronDownIcon className="size-4 group-[data-state=open]:rotate-180 group-[data-state=closed]:rotate-90" />
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
    </Sidebar>
  );
}
