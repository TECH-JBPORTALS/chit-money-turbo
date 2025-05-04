import { View } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { H3, Muted, P, Small } from "~/components/ui/typography";
import { ArrowRight } from "~/lib/icons/ArrowRight";
import { Files } from "~/lib/icons/Files";
import { Landmark } from "~/lib/icons/Landmark";
import { User } from "~/lib/icons/User";
import { Building2 } from "~/lib/icons/Building2";
import { PhoneCall } from "~/lib/icons/PhoneCall";
import { QrCode } from "~/lib/icons/QrCode";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ScrollView } from "react-native-gesture-handler";

export default function ChitFundHouse() {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="py-6 px-4 gap-6">
        {/** Avatar & Details */}
        <View className="items-center gap-2">
          <Avatar alt="Chit fund profile pic" className="size-28">
            <AvatarImage source={{ uri: "https://github.com/x-sss-x.png" }} />
            <AvatarFallback>
              <Text>A</Text>
            </AvatarFallback>
          </Avatar>
          <H3>Surya Chit Fund</H3>
          <Muted>Started on 25th Jan, 2025</Muted>
        </View>

        {/** QR code button */}
        <Button variant={"outline"}>
          <QrCode className="size-4 " />
          <Text>Get QR Code to Pay</Text>
          <ArrowRight className="size-4 " />
        </Button>

        {/** Owner */}
        <View className="gap-3">
          <View className="flex-row gap-1 items-center">
            <User className={"size-4 text-foreground"} />
            <P>Owner</P>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">Full Name</Small>
            <Muted>Surya Yadav</Muted>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">Email address</Small>
            <Muted>surya@gmail.com</Muted>
          </View>
        </View>

        {/** Contact */}
        <View className="gap-3">
          <View className="flex-row gap-1 items-center">
            <PhoneCall className={"size-4 text-foreground"} />
            <P>Contact</P>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">Phone Number</Small>
            <Muted>9283933839</Muted>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">Address</Small>
            <Muted className="text-right flex-0.5 w-3/5">
              #253, Sheshadri Nilaya, JP Nagar, Banglore - 564902
            </Muted>
          </View>
        </View>

        {/** Chit Fund House */}
        <View className="gap-3">
          <View className="flex-row gap-1 items-center">
            <Building2 className={"size-4 text-foreground"} />
            <P>Chit Fund House</P>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">Full Name</Small>
            <Muted>Surya Chit Fund</Muted>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">Address</Small>
            <Muted className="text-right flex-0.5 w-3/5">
              #253, Sheshadri Nilaya, JP Nagar, Banglore - 564902
            </Muted>
          </View>
        </View>

        {/** Bank Details */}
        <View className="gap-3">
          <View className="flex-row gap-1 items-center">
            <Landmark className={"size-4 text-foreground"} />
            <P>Bank Details</P>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">Account Number</Small>
            <Muted>283929202339303</Muted>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">Holder Name</Small>
            <Muted>SURYA YADAV</Muted>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">Branch</Small>
            <Muted className="text-right flex-0.5 w-3/5">
              SBI, BC Road Branch
            </Muted>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">IFSC Code</Small>
            <Muted>SBIN0005778</Muted>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">UPI ID</Small>
            <Muted>9283933839@ybl</Muted>
          </View>
        </View>

        {/** Documents */}
        <View className="gap-3">
          <View className="flex-row gap-1 items-center">
            <Files className={"size-4 text-foreground"} />
            <P>Documents</P>
          </View>
          <Button variant={"outline"} className="justify-between">
            <Text>Owner Aadhar Card</Text>
            <ArrowRight className=" size-4" />
          </Button>
          <Button variant={"outline"} className="justify-between">
            <Text>Chit Fund Registration Certificate</Text>
            <ArrowRight className=" size-4" />
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
