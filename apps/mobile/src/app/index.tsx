import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ArrowRight } from "~/lib/icons/ArrowRight";

export default function Welcome() {
  return (
    <View className="flex-1 bg-background p-6 items-center gap-12 justify-end">
      <View className="gap-4 items-center w-full">
        <Text className="text-4xl font-extrabold text-foreground text-center">
          Manage all your chit funds
        </Text>
        <Text className="text-muted-foreground text-sm font-normal text-center w-5/6">
          Get due dates, payment history, credit score all in one place
        </Text>
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
  );
}
