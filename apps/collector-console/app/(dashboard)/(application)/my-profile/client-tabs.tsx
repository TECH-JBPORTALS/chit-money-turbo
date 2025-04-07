"use client";
import { Tabs, TabsList, TabsTrigger } from "@cmt/ui/components/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ClientTabs() {
  const pathname = usePathname();
  console.log(pathname.split("/").at(2));

  return (
    <Tabs
      value={pathname === "/my-profile" ? "account" : pathname.split("/").at(2)}
    >
      <TabsList className="w-full grid grid-cols-8">
        <TabsTrigger value="account" asChild>
          <Link href="/my-profile">Account</Link>
        </TabsTrigger>
        <TabsTrigger value="organization" asChild>
          <Link href="/my-profile/organization">Organization</Link>
        </TabsTrigger>
        <TabsTrigger value="bank-account" asChild>
          <Link href="/my-profile/bank-account">Bank Account</Link>
        </TabsTrigger>
        <TabsTrigger value="documents" asChild>
          <Link href="/my-profile/documents">Documents</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
