import { View, ScrollView } from "react-native";
import React from "react";
import { LinearBlurView } from "~/components/linear-blurview";
import { H2, Large, Muted } from "~/components/ui/typography";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Radar } from "~/lib/icons/Radar";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { Landmark } from "~/lib/icons/Landmark";
import { User } from "~/lib/icons/User";
import { Files } from "~/lib/icons/Files";
import { Contact } from "~/lib/icons/Contact";
import { LogOut } from "~/lib/icons/LogOut";

const items = [
  {
    name: "Personal & Nominee Details",
    icon: User,
  },
  {
    name: "Credit Score History",
    icon: Radar,
  },
  {
    name: "Documents",
    icon: Files,
  },
  {
    name: "Contact Details",
    icon: Contact,
  },
  {
    name: "Bank Details",
    icon: Landmark,
  },
];

export default function Profile() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <LinearBlurView>
        <H2>Your Profile</H2>

        {/** Profile Pic & Details */}
        <View className="flex-row gap-3.5 items-center">
          <Avatar alt="Your Profile Pic" className="size-16">
            <AvatarImage source={{ uri: "https://github.com/shadcn.png" }} />
            <AvatarFallback>
              <Text>A</Text>
            </AvatarFallback>
          </Avatar>
          <View className="gap-1">
            <Large>Tommy</Large>
            <Muted>tommy@gmail.com</Muted>
          </View>
        </View>

        {/** Profile Menu */}
        <View className="gap-1">
          {items.map((item, index) => (
            <Button
              key={index}
              className="justify-between native:px-2 native:py-2"
              variant={"ghost"}
            >
              <View className="gap-2 flex-row items-center">
                <item.icon strokeWidth={1} className="size-6 text-foreground" />
                <Text>{item.name}</Text>
              </View>
              <ChevronRight className="size-4 text-foreground" />
            </Button>
          ))}
        </View>

        <Button size={"lg"} variant={"outline"}>
          <Text className="text-secondary-foreground">Logout</Text>
          <LogOut className="size-4 text-secondary-foreground" />
        </Button>
      </LinearBlurView>
    </ScrollView>
  );
}
