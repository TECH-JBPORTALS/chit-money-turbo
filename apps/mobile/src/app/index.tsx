import { StyleSheet, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H1, Muted } from "~/components/ui/typography";
import { ArrowRight } from "~/lib/icons/ArrowRight";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

export default function Welcome() {
  return (
    <View className="flex-1 relative bg-background">
      <BlurView
        intensity={10}
        tint="dark"
        style={[StyleSheet.absoluteFill, { inset: 0, height: "100%" }]}
      >
        <LinearGradient
          colors={["rgba(5, 150, 105,0.2)", "transparent"]}
          style={[{ inset: 0, height: "100%", alignItems: "center" }]}
        />
      </BlurView>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 p-6 z-50 items-center gap-12 justify-end">
        <View className="gap-4 items-center w-full">
          <Image
            source={require("assets/chit-coin.png")}
            style={{ height: 260, width: 260, marginBottom: 48 }}
            contentFit="contain"
          />
          <H1 className="text-center">Manage all your chit funds</H1>
          <Muted className="text-center w-5/6">
            Get due dates, payment history, credit score all in one place
          </Muted>
        </View>
        <View className="w-full gap-2">
          <Button size={"lg"}>
            <Text>Get Started</Text>
            <ArrowRight className="size-4 text-primary-foreground" />
          </Button>
          <Button size={"lg"} variant={"secondary"}>
            <Text>Sign In</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
