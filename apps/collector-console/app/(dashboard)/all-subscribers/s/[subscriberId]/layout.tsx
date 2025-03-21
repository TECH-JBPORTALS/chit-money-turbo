import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Button } from "@cmt/ui/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cmt/ui/components/card";
import { ArrowLeftIcon, Circle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@cmt/ui/components/tabs";
import { ScrollArea, ScrollBar } from "@cmt/ui/components/scroll-area";
import Link from "next/link";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { subscriberId: string };
}) {
  return (
    <section className="w-full h-full flex">
      <ScrollArea className="flex-1">
        <div className="flex flex-col  w-full gap-6 py-8 px-4 pb-20">
          {/* Subscriber Header*/}
          <div className="flex items-center gap-4">
            <Button className="rounded-full" variant={"outline"} size={"icon"}>
              <ArrowLeftIcon />
            </Button>
            <Avatar className="size-12 border border-border">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Ada Shelby
              </h4>
              <p className="text-muted-foreground text-sm">
                whatyouwant@gmail.com
              </p>
            </div>
          </div>

          {/** Tabs */}
          <Tabs value="general" className="w-[400px]">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger asChild value="general">
                <Link href={`/all-subscribers/s/${params.subscriberId}`}>
                  General
                </Link>
              </TabsTrigger>
              <TabsTrigger value="subscribed">
                <Link
                  href={`/all-subscribers/s/${params.subscriberId}/subscribed-batches`}
                >
                  Subscribed Batches
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {children}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <ScrollArea className="w-[384px] max-h-svh border-l  ">
        <aside className="h-full px-4 py-8 flex flex-col gap-3">
          <div>
            <p className="text-xl ">Credit Score</p>
            <p className="text-sm text-muted-foreground">
              Current credit score for this subscriber and history
            </p>
          </div>

          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
            264
          </h1>
          <div className="flex gap-0.5">
            <div className="w-full rounded-sm bg-primary/20 h-8" />
            <div className="w-full rounded-sm bg-primary h-8" />
            <div className="w-full rounded-sm bg-destructive h-8" />
          </div>
          <div className="text-center space-x-2">
            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <span>
                <Circle className="fill-primary/20 size-2 text-transparent" />
              </span>
              23 Pre Payments
            </p>

            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <span>
                <Circle className="fill-primary size-2 text-transparent" />
              </span>
              23 On-Time Payments
            </p>

            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <span>
                <Circle className="fill-destructive size-2 text-transparent" />
              </span>
              23 Late Payments
            </p>
          </div>

          {Array.from({ length: 20 })
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="flex-row px-3 py-4 justify-between">
                <CardHeader className="w-full p-0">
                  <CardTitle>JNANA 2024</CardTitle>
                  <CardDescription>24 Jun, 2024</CardDescription>
                </CardHeader>
                <CardFooter className="w-full flex flex-col items-end text-right p-0">
                  <p className="text-right">₹3,000</p>
                  <span className="text-primary text-right">+5</span>
                </CardFooter>
              </Card>
            ))}
        </aside>
      </ScrollArea>
    </section>
  );
}
