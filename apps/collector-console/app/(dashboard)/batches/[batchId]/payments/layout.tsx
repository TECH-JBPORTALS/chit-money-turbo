import { Button } from "@cmt/ui/components/button";
import { ScrollArea } from "@cmt/ui/components/scroll-area";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full flex h-full">
      <ScrollArea className="flex-1">
        <div className="flex-1 pl-1 pr-4 py-8">{children}</div>
      </ScrollArea>
      <ScrollArea className="h-full w-[250px] max-h-svh border-l">
        <aside className=" w-full flex flex-col gap-4 py-8">
          <div className="px-4">
            <p className="text-xl">Months</p>
            <p className="text-sm text-muted-foreground">
              Runway of months for your current batch
            </p>
          </div>

          <div>
            <Button
              className="rounded-s-none bg-accent border-l-2 border-l-primary w-full justify-start"
              variant={"ghost"}
            >
              Jan 2024
            </Button>
            <Button
              className="rounded-s-none justify-start w-full"
              variant={"ghost"}
            >
              Feb 2024
            </Button>
          </div>
        </aside>
      </ScrollArea>
    </section>
  );
}
