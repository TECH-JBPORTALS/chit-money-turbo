import { View } from "react-native";
import { LinearBlurView } from "~/components/linear-blurview";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ArrowRight } from "~/lib/icons/ArrowRight";
import { H1, H2, Lead, P } from "~/components/ui/typography";

export default function Page() {
  return (
    <LinearBlurView>
      <H2>Hey, Tommy 🙏</H2>

      {/** Credit Score */}
      <View className="gap-4">
        <Lead>Your Credit Score</Lead>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 ">
            <H1 className="text-6xl">764</H1>
            <P className="text-destructive">-20</P>
          </View>
          <Button variant={"outline"}>
            <Text>History</Text>
            <ArrowRight className="text-foreground size-4" />
          </Button>
        </View>
      </View>

      {/** Overall Stat Cards */}
      <View className="gap-4">
        <Lead>Overall</Lead>
        <View></View>
      </View>

      {/** Upcoming Payments */}
      <View className="gap-4">
        <Lead>Upcoming Payments</Lead>
        <View></View>
      </View>
    </LinearBlurView>
  );
}
