import { Button } from "@cmt/ui/components/button";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex bg-linear-120 w-full flex-col from-primary/10 to-primary/5 items-center min-h-svh">
      <div className="size-[735px] rounded-full absolute -top-1/2 bg-primary" />
      <div className="flex z-20 bg-background/40 backdrop-blur-[180px] w-full flex-col items-center pt-32  min-h-svh gap-4">
        <div className="flex flex-col">
          <Image
            src={"/chit-coin.png"}
            height={150}
            width={150}
            alt="Chit.Money Coin"
            className="mb-10 animate-water-flow"
          />
          <h2 className="text-3xl font-bold text-center ">Chit.Money</h2>
        </div>
        <h1 className="text-5xl font-heading font-black w-2/4 text-center">
          Modernize Your <span className="text-primary">Chit Fund</span>{" "}
          Management
        </h1>
        <p className="text-lg w-2/5 text-center text-muted-foreground">
          Streamline operations, build trust, and grow your chit fund business
          with our digital management platform designed specifically for
          collectors.
        </p>
        <div className="flex gap-4">
          <Button
            className="h-11 text-primary bg-primary/5 border-primary"
            variant={"outline"}
            size={"lg"}
          >
            Get a Demo
          </Button>
          <Button className="h-11 group" size={"lg"}>
            Get Started{" "}
            <ArrowRightIcon className=" group-hover:translate-x-1 transition-all duration-150" />
          </Button>
        </div>

        <section className="px-24 py-20 w-full">
          <div className="relative h-[846px]  w-full">
            <Image
              quality={100}
              src={"/chrome-collector-home.png"}
              fill
              alt="Chrome Collector Home Page"
              objectFit="contain"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
