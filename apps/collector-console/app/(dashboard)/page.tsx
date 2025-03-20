import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cmt/ui/components/card";
import { Avatar, AvatarImage, AvatarFallback } from "@cmt/ui/components/avatar";
import { Progress } from "@cmt/ui/components/progress";
import { api } from "@cmt/api";
export default async function Page() {
  const { userId } = await auth();

  if (!userId) throw Error("No user");
  const { users } = await clerkClient();
  const data = await users.getUser(userId);

  return (
    <div className="flex flex-col gap-8 text-2xl">
      {/* Chit Fund Title */}
      <div>
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {data.privateMetadata.orgInfo.company_fullname}
        </h2>
        <p className="text-sm text-muted-foreground">
          All over details in this chit fund
        </p>
      </div>
      {/* Overview stat cards  grid*/}
      <div className="grid lg:grid-cols-4 xl:grid-cols-5 gap-2">
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Total Batches</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              30
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="inline-flex -space-x-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Avatar className="border-3 border-card size-8" key={i}>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="text-muted-foreground">
              400 Subscribers from 30 batches
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Total Subscriber</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              70
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              Total subscribers involved in this chit fund
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Total Collection</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              ₹40,00,000
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="w-full">
              <Progress value={80} />
            </div>
            <div className="text-muted-foreground">
              Still <b>₹10,00,000</b> payment pending this month
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Total Penalty Collected</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              ₹80,00,000
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              collected from 20 transactions
            </div>
          </CardFooter>
        </Card>
      </div>
      {/* This month details sub-title */}
      <div>
        <div className="text-lg font-semibold">This Month</div>
        <p className="text-sm text-muted-foreground">
          All over details in this chit fund for this month
        </p>
      </div>
      {/* This month stat cards grid */}
      <div className="grid lg:grid-cols-4 xl:grid-cols-5 gap-2">
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Total Collection</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              ₹8,00,000
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="w-full">
              <Progress value={80} />
            </div>
            <div className="text-muted-foreground">
              Still <b>₹2,00,000</b> payment pending out of <b>₹10,00,000</b>{" "}
              this month
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Total Penalty Collected</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              ₹6,000
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              collected from 8 transactions
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Pre Payments</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              2
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              pre payments from 2 batches
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Late Payments</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              10
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              late payments from 8 batches
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card min-h-44">
          <CardHeader className="relative">
            <CardDescription>On-Time Payments</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              20
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="text-muted-foreground">
              on time payments from 9 batches
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
