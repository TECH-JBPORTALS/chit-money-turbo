import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cmt/ui/components/card";
import React from "react";

export default function PaymentCard() {
  return (
    <Card className="flex-row px-3 py-4 justify-between">
      <CardHeader className="w-full p-0">
        <CardTitle>JNANA 2024</CardTitle>
        <CardDescription>24 Jun, 2024</CardDescription>
      </CardHeader>
      <CardFooter className="w-full flex flex-col items-end text-right p-0">
        <p className="text-right">₹3,000</p>
        <span className="text-primary text-right">+5</span>
      </CardFooter>
    </Card>
  );
}
