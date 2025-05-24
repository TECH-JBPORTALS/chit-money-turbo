import { Alert, ToastAndroid, View } from "react-native";
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
import { ArrowUpRight } from "~/lib/icons/ArrowUpRight";
import { QrCode } from "~/lib/icons/QrCode";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ScrollView } from "react-native-gesture-handler";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "~/utils/api";
import { useLocalSearchParams } from "expo-router";
import { SpinnerView } from "~/components/spinner-view";
import { format } from "date-fns";
import {
  RetryView,
  RetryViewButton,
  RetryViewDescription,
  RetryViewIcon,
  RetryViewTitle,
} from "~/components/retry-view";
import * as Linking from "expo-linking";

export default function ChitFundHouse() {
  const { id, chitId } = useLocalSearchParams<{ id: string; chitId: string }>();
  const {
    data: collector,
    isLoading,
    isError,
    refetch,
  } = useQuery(trpc.collectors.getById.queryOptions(id));

  if (isLoading) return <SpinnerView />;

  if (!collector || isError)
    return (
      <RetryView>
        <RetryViewIcon />
        <RetryViewTitle>Something went wrong!</RetryViewTitle>
        <RetryViewDescription className="px-10">
          May be couldn't able to find collector profile or something broke
        </RetryViewDescription>
        <RetryViewButton onPress={() => refetch()}>
          <Text>Retry</Text>
        </RetryViewButton>
      </RetryView>
    );

  const openUPIPayment = async () => {
    const upiId = collector?.bankAccount.upiId;
    const name = `${collector.orgName}`;
    const transactionNote = `Subscription Payment ( ${chitId} )`;

    const url = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      Linking.openURL(url);
    } else {
      ToastAndroid.showWithGravity(
        "UPI not supported",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="py-6 px-4 gap-6">
        {/** Avatar & Details */}
        <View className="items-center gap-2">
          <Avatar alt="Chit fund profile pic" className="size-28">
            <AvatarImage source={{ uri: "" }} />
            <AvatarFallback>
              <Text className="text-6xl font-bold text-background">
                {collector?.orgName.charAt(0)}
              </Text>
            </AvatarFallback>
          </Avatar>
          <H3>{collector?.orgName}</H3>
          <Muted>
            Started on {format(collector.createdAt, "do, MMM yyyy")}
          </Muted>
        </View>

        {/** QR code button */}
        <Button onPress={() => openUPIPayment()} variant={"outline"}>
          <QrCode className="size-4 text-secondary-foreground" />
          <Text>Pay through UPI App</Text>
          <ArrowUpRight className="size-4 text-secondary-foreground" />
        </Button>

        {/** Owner */}
        <View className="gap-3">
          <View className="flex-row gap-1 items-center">
            <User className={"size-4 text-foreground"} />
            <P>Owner</P>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">Full Name</Small>
            <Muted>
              {collector.firstName} {collector.lastName}
            </Muted>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">Email address</Small>
            <Muted>{collector.primaryEmailAddress?.emailAddress}</Muted>
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
            <Muted>{collector.contact.primaryPhoneNumber}</Muted>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">Secondary Number</Small>
            <Muted>{collector.contact.secondaryPhoneNumber}</Muted>
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
            <Muted>{collector.orgName}</Muted>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">Address</Small>
            <Muted className="text-right flex-0.5 w-3/5">
              {collector.address.addressLine}, {collector.address.city},{" "}
              {collector.address.state} - {collector.address.pincode}
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
            <Muted>{collector.bankAccount.accountNumber}</Muted>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">Holder Name</Small>
            <Muted>{collector.bankAccount.accountHolderName}</Muted>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">Branch</Small>
            <Muted className="text-right flex-0.5 w-3/5">
              {collector.bankAccount.branchName}
            </Muted>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">IFSC Code</Small>
            <Muted>{collector.bankAccount.ifscCode}</Muted>
          </View>
          <View className="flex-row justify-between">
            <Small className="font-bold">UPI ID</Small>
            <Muted>{collector.bankAccount.upiId}</Muted>
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
            <ArrowRight className="size-4 text-secondary-foreground" />
          </Button>
          <Button variant={"outline"} className="justify-between">
            <Text>Chit Fund Registration Certificate</Text>
            <ArrowRight className="size-4 text-secondary-foreground" />
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
