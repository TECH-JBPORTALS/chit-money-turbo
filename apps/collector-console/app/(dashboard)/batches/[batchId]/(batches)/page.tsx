import EmptyState from "@/components/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Button } from "@cmt/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cmt/ui/components/card";
import { Progress } from "@cmt/ui/components/progress";
import { Badge } from "@cmt/ui/components/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@cmt/ui/components/tabs";
import {
  ArrowUpRightIcon,
  BadgeCheckIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@cmt/ui/components/tooltip";
import Link from "next/link";
import { ScrollArea } from "@cmt/ui/components/scroll-area";
import SearchInput from "@/components/search-input";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      {/* Batch Title */}
      <div className="inline-flex justify-between">
        <div>
          <h2 className="scroll-m-20 pb-2 text-3xl font-bold tracking-tight first:mt-0">
            January 2024
          </h2>
          <div className="space-x-2">
            <Badge
              variant={"secondary"}
              className=" font-semibold rounded-full"
            >
              ₹1,00,000
            </Badge>

            <Badge
              variant={"secondary"}
              className=" font-semibold rounded-full"
            >
              20 Months Fund
            </Badge>
            <Badge
              variant={"secondary"}
              className=" font-semibold rounded-full"
            >
              ₹ 5,000 / Month
            </Badge>
          </div>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size={"icon"} asChild variant={"outline"}>
              <Link href={"#"}>
                <SettingsIcon />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Batch Settings</TooltipContent>
        </Tooltip>
      </div>
      {/* Overview stat cards  grid*/}
      <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-2">
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>This Month Payments</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              7/20
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-2.5 text-sm">
            <div className="inline-flex gap-1">
              <div className="inline-flex -space-x-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Avatar className="border-3 border-card size-5" key={i}>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                2 pending payments
              </span>
            </div>
            <Button variant={"outline"} className="w-full">
              View Payments
            </Button>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>This Month Chit Holder</CardDescription>
            <div className="inline-flex items-center gap-2">
              <Avatar className="border-3 border-card size-10">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <b>Jhon Snow</b>
                <p className="text-sm text-muted-foreground">#738392J</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Recieves 1 lakh</div>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" variant={"outline"}>
              <BadgeCheckIcon /> Payout
            </Button>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>{"This Month's Collection"}</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              ₹85,000
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="w-full">
              <Progress value={80} />
            </div>
            <div className="text-muted-foreground">
              Still <b>₹15,000</b> payment pending this month
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>{"Fund Progress"}</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              2 / 20
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="w-full">
              <Progress value={80} />
            </div>
            <div className="text-muted-foreground">
              2 out of 20 months are completed, still 18 months to go
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Quick Action Cards*/}
      <div className="flex gap-2 w-full">
        <Card className="h-[680px] max-h-h-[680px] min-h-h-[680px] overflow-hidden w-full gap-2">
          <CardHeader>
            <CardTitle className=" text-lg font-semibold tabular-nums">
              {"This Month's Payments"}
            </CardTitle>
            <SearchInput placeholder="Search..." className="w-full" />
          </CardHeader>
          <CardContent className="h-full max-h-full pb-16">
            <ScrollArea className="h-full pr-4 ">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="border-3 border-card size-10">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <b>Jhon Snow</b>
                      <p className="text-sm text-muted-foreground">#738392J</p>
                    </div>
                  </div>
                  <div>
                    <Badge variant={"secondary"}>₹ 5,000</Badge>
                  </div>
                  <div>
                    <Button variant={"secondary"}>
                      <PlusIcon /> Collect
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="w-full h-[680px] max-h-h-[680px] min-h-h-[680px] overflow-hidden gap-2">
          <Tabs defaultValue="payouts" className="w-full h-full">
            <CardHeader>
              <TabsList className="w-full">
                <TabsTrigger value="payouts">Payouts</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="h-full max-h-full">
              <TabsContent value="payouts" className="h-full">
                <ScrollArea className="h-full pr-4 pb-8">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="border-3 border-card size-10">
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="@shadcn"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                          <b>Jhon Snow</b>
                          <p className="text-sm text-muted-foreground">
                            #738392J
                          </p>
                        </div>
                      </div>
                      <div>
                        <Badge variant={"secondary"}>1. Jan 2024</Badge>
                      </div>
                      <div>
                        <Button variant={"secondary"}>
                          <ArrowUpRightIcon /> Payout
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="requests" className="h-full">
                <div className="h-full flex items-center justify-center">
                  <EmptyState
                    title="No Requests"
                    description="Any request for payouts can be seen here"
                  />
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
