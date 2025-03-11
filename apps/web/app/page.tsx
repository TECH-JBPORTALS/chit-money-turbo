import { Button } from "@cmt/ui/components/button";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-bold w-2/3 text-center">
          Modernize Your Chit Fund Management
        </h1>
        <p className="text-base w-2/3 text-center text-muted-foreground">
          Streamline operations, build trust, and grow your chit fund business
          with our digital management platform designed specifically for
          collectors.
        </p>
        <Button size={"lg"}>Get Started</Button>
      </div>
    </div>
  );
}
