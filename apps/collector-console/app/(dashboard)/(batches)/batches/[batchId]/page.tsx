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
import { Input } from "@cmt/ui/components/input";
import { Progress } from "@cmt/ui/components/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@cmt/ui/components/tabs";
import { BadgeCheckIcon, SearchIcon } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      {/* Batch Title */}
      <div>
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          January 2024
        </h2>
        <p className="text-sm text-muted-foreground">
          All over details in this chit fund
        </p>
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
            <div className="inline-flex items-center">
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
      <div className="flex gap-2 w-full h-[620px]">
        <Card className="@container/card w-full">
          <CardHeader className="relative">
            <CardTitle className=" text-lg font-semibold tabular-nums">
              {"This Month's Payments"}
            </CardTitle>
            <div className="relative flex w-full items-center">
              <SearchIcon className="absolute ml-2.5 mr-2.5 size-4 text-muted-foreground" />
              <Input placeholder="Search..." className="h-10 ps-8" />
            </div>
          </CardHeader>
          <CardContent className="h-full">
            <div className="h-full flex items-center justify-center">
              <EmptyState
                title="No Payments"
                description="Any payouts has been done in this month can be seen here"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="@container/card w-full h-[620px]">
          <Tabs defaultValue="payouts" className="w-full h-full">
            <CardHeader className="relative">
              <TabsList className="w-full">
                <TabsTrigger value="payouts">Payouts</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
              </TabsList>
            </CardHeader>
            <TabsContent value="payouts" className="h-full">
              <div className="h-full flex items-center justify-center">
                <EmptyState
                  title="No Payouts"
                  description="Any payouts has been done that can be seen here"
                />
              </div>
            </TabsContent>
            <TabsContent value="requests" className="h-full">
              <div className="h-full flex items-center justify-center">
                <EmptyState
                  title="No Requests"
                  description="Any request for payouts can be seen here"
                />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
