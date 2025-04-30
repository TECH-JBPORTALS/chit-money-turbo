import { createQueryClient } from "@/trpc/query-client";
import { trpc } from "@/trpc/server";
import { Button } from "@cmt/ui/components/button";
import { ArrowUpRightSquare } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ subscriberId: string }>;
}) {
  const client = createQueryClient();
  const { subscriberId } = await params;
  const sub = await client.fetchQuery(
    trpc.subscribers.getById.queryOptions({ subscriberId })
  );

  return (
    <>
      {/** Personal Details */}
      <div className="space-y-2 text-sm">
        <p className="text-sm text-muted-foreground">Personal Details</p>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Full Name</b>
          <p>
            {sub.firstName} {sub.lastName}
          </p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Email Address</b>
          <p>{sub.primaryEmailAddress?.emailAddress}</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Date Of Birth</b>
          <p>{sub.dateOfBirth && new Date(sub.dateOfBirth).toDateString()}</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Joined On</b>
          <p>{sub.createdAt && new Date(sub.createdAt).toDateString()}</p>
        </div>
      </div>
      {/** Nominee Details */}
      <div className="space-y-2 text-sm">
        <p className="text-sm text-muted-foreground">Personal Details</p>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Nominee Full Name</b>
          <p>{sub.nomineeName}</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Nominee Relationship</b>
          <p>{sub.nomineeRelationship}</p>
        </div>
      </div>

      {/** Contact Details */}
      <div className="space-y-2 text-sm">
        <p className="text-sm text-muted-foreground">Contact Details</p>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Primary Phone Number</b>
          <p>{sub.contact?.primaryPhoneNumber}</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Secondary Phone Number</b>
          <p>{sub.contact?.secondaryPhoneNumber}</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Complete Address</b>
          <p className="w-80 text-right">
            {sub.homeAddress?.addressLine}, {sub.homeAddress?.city},{" "}
            {sub.homeAddress?.state} {sub.homeAddress?.pincode}
          </p>
        </div>
      </div>
      {/** Bank Details */}
      <div className="space-y-2 text-sm">
        <p className="text-sm text-muted-foreground">Bank Details</p>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">UPI ID</b>
          <p>{sub.bankAccount?.upiId}</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Account Number</b>
          <p>{sub.bankAccount?.accountNumber}</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Account Holder Name</b>
          <p className="w-80 text-right">
            {sub.bankAccount?.accountHolderName}
          </p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">IFSC Code</b>
          <p className="w-80 text-right">{sub.bankAccount?.ifscCode}</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Branch Name</b>
          <p className="w-80 text-right">{sub.bankAccount?.branchName}</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Branch Address</b>
          <p className="w-80 text-right">
            {sub.bankAccount?.city}, {sub.bankAccount?.state}{" "}
            {sub.bankAccount?.pincode}
          </p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Account Type</b>
          <p className="w-80 text-right capitalize">
            {sub.bankAccount?.accountType}
          </p>
        </div>
      </div>
      {/** Documents */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Documents</p>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">PAN Card Number</b>
          <p>{sub.panCardNumber}</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <Button variant={"outline"} className="w-full justify-between">
            Aadhar Card <ArrowUpRightSquare />
          </Button>
        </div>
      </div>
    </>
  );
}
