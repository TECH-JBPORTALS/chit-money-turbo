"use client";
import { Button } from "@cmt/ui/components/button";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      className="rounded-full"
      variant={"outline"}
      size={"icon"}
    >
      <ArrowLeftIcon />
    </Button>
  );
}
