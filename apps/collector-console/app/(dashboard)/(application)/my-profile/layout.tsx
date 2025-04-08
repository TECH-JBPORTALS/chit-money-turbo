import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Button } from "@cmt/ui/components/button";
import ClientTabs from "./client-tabs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 py-8 pr-20">
      {/* Header */}
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          My Profile
        </h3>
      </div>

      {/** Chit Fund Profile and Signout Row */}
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex items-center flex-row gap-2">
          <Avatar className="size-16">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Red Right Hand
            </h4>
            <p className="text-sm text-muted-foreground">
              red.right.hand@gmail.com
            </p>
          </div>
        </div>
        <Button variant={"outline"} className="w-fit">
          Sign Out
        </Button>
      </div>

      {/** Sub navigation */}
      <ClientTabs />

      {children}
    </div>
  );
}
