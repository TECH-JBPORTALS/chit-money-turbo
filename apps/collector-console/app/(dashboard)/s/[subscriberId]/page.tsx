import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Button } from "@cmt/ui/components/button";
import { ArrowLeftIcon, ArrowUpRightSquare } from "lucide-react";

export default function Page() {
  return (
    <>
      {/** Personal Details */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Personal Details</p>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Full Name</b>
          <p>Gina shelby</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Email Address</b>
          <p>whatyouwant@gmail.com</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Date Of Birth</b>
          <p>12 May 2004</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Joined On</b>
          <p>24 Dec 2024</p>
        </div>
      </div>
      {/** Nominee Details */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Personal Details</p>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Nominee Full Name</b>
          <p>Rohan Shelby</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Nominee Relationship</b>
          <p>Son</p>
        </div>
      </div>

      {/** Contact Details */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Contact Details</p>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Primary Phone Number</b>
          <p>9836738393</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Alternative Phone Number</b>
          <p>7093536273</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Complete Address</b>
          <p className="w-80 text-right">
            #254, Sheshadri Nilaya, 4th block, Jayanagar, Banglore 560107
          </p>
        </div>
      </div>
      {/** Bank Details */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Bank Details</p>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">UPI ID</b>
          <p>ada.shelby@ibl</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Account Number</b>
          <p>9838293936738393</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Account Holder Name</b>
          <p className="w-80 text-right">ADA SHELBY</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">IFSC Code</b>
          <p className="w-80 text-right">INR2890238</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Branch Name</b>
          <p className="w-80 text-right">Birmigham, London</p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Bank Address</b>
          <p className="w-80 text-right">
            Small Heath, Birmigham, London 234913
          </p>
        </div>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">Account Type</b>
          <p className="w-80 text-right">Savings</p>
        </div>
      </div>
      {/** Documents */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Documents</p>
        <div className="inline-flex w-full justify-between">
          <b className="font-bold text-right">PAN Card Number</b>
          <p>PMY8X9283</p>
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
