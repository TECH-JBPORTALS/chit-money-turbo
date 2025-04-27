import { View, ScrollView } from "react-native";
import React, { useState } from "react";
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
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";

const items = [
  {
    name: "Personal & Nominee Details",
    icon: User,
    url: "/profile/pn-details",
  },
  {
    name: "Credit Score History",
    icon: Radar,
    url: "/credit-score",
  },
  {
    name: "Documents",
    icon: Files,
    url: "/profile/documents",
  },
  {
    name: "Contact Details",
    icon: Contact,
    url: "/profile/contact-details",
  },
  {
    name: "Bank Details",
    icon: Landmark,
    url: "/profile/bank-details",
  },
];

export default function Profile() {
  const { signOut } = useAuth();
  const [isSigningOut, setIsSingingOut] = useState(false);
  const { user } = useUser();

  async function onSignout() {
    setIsSingingOut(true);
    await signOut();
    setIsSingingOut(false);
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <LinearBlurView>
        <H2>Your Profile</H2>

        {/** Profile Pic & Details */}
        <View className="flex-row gap-3.5 items-center">
          <Avatar alt="Your Profile Pic" className="size-16">
            <AvatarImage source={{ uri: user?.imageUrl }} />
            <AvatarFallback>
              <Text>{user?.firstName?.charAt(0).toUpperCase()}</Text>
            </AvatarFallback>
          </Avatar>
          <View className="gap-1">
            <Large>
              {user?.firstName} {user?.lastName}
            </Large>
            <Muted>{user?.primaryEmailAddress?.emailAddress}</Muted>
          </View>
        </View>

        {/** Profile Menu */}
        <View className="gap-1">
          {items.map((item, index) => (
            <Link href={item.url} key={index + item.name} asChild>
              <Button
                className="justify-between native:px-2 native:py-2"
                variant={"ghost"}
              >
                <View className="gap-2 flex-row items-center">
                  <item.icon
                    strokeWidth={1}
                    className="size-6 text-foreground"
                  />
                  <Text>{item.name}</Text>
                </View>
                <ChevronRight className="size-4 text-foreground" />
              </Button>
            </Link>
          ))}
        </View>

        <Button
          isLoading={isSigningOut}
          onPress={onSignout}
          size={"lg"}
          variant={"outline"}
        >
          <Text className="text-secondary-foreground">Logout</Text>
          <LogOut className="size-4 text-secondary-foreground" />
        </Button>
      </LinearBlurView>
    </ScrollView>
  );
}
