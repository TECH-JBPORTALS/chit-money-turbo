import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { SolarIcon } from "react-native-solar-icons";
import { H4 } from "~/components/ui/typography";
import { FlashList } from "@shopify/flash-list";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "~/lib/icons/ArrowRight";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RouterOutputs, trpc } from "~/utils/api";
import { Link, useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { SpinnerView } from "~/components/spinner-view";

type Runway = RouterOutputs["chits"]["getRunway"][number];

function RequestButton({ month }: { month: Date }) {
  const { subToBatchId } = useLocalSearchParams<{ subToBatchId: string }>();
  const queryClient = useQueryClient();
  const { mutate: requestPayout, isPending } = useMutation(
    trpc.payouts.request.mutationOptions({
      onSuccess() {
        queryClient.invalidateQueries(trpc.chits.getRunway.queryFilter());
      },
    })
  );

  return (
    <Button
      isLoading={isPending}
      onPress={() =>
        requestPayout({ subscriberToBatchId: subToBatchId, month })
      }
      size="sm"
      className="bg-foreground dark:bg-foreground"
    >
      <Text className="text-background dark:text-background">Request</Text>
    </Button>
  );
}

function getStatusElement(
  status: string | undefined,
  payoutId: string | undefined,
  month: Date
) {
  switch (status) {
    case "completed":
      return <SolarIcon size={16} name="CheckCircle" color="green" />;
    case "requested":
      return (
        <Badge className="bg-orange-500 flex-row gap-1">
          <Text>Requested</Text>
          <ArrowRight size={14} className="text-primary-foreground" />
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant={"destructive"} className="flex-row gap-1">
          <Text>Rejected</Text>
          <ArrowRight size={14} className="text-primary-foreground" />
        </Badge>
      );
    case "approved":
      return (
        <Link asChild href={`/payout/${payoutId}`}>
          <Badge className="bg-indigo-500 flex-row gap-1">
            <Text>Approved</Text>
            <ArrowRight size={14} className="text-primary-foreground" />
          </Badge>
        </Link>
      );
    case "available":
      return <RequestButton month={month} />;
    default:
      return null;
  }
}

function Runway({ item }: { item: Runway }) {
  const StatusElement = getStatusElement(
    item.payoutStatus,
    item.payoutId,
    item.date
  );

  return (
    <View className="flex-row items-center justify-between py-3">
      <View className="flex-row items-center gap-3">
        <H4>{item.id}.</H4>
        <Text className="text-base">{format(item.date, "MMM dd, yyyy")}</Text>
      </View>
      <View className="flex-row items-center space-x-2">{StatusElement}</View>
    </View>
  );
}

export default function BatchRunwayScreen() {
  const { subToBatchId } = useLocalSearchParams<{ subToBatchId: string }>();
  const { data, isLoading, isRefetching } = useQuery(
    trpc.chits.getRunway.queryOptions({ subToBatchId })
  );

  // Memoized transaction data to prevent unnecessary re-renders
  const transactions = data ?? [];

  console.log(transactions);

  if (isLoading || isRefetching) return <SpinnerView />;

  return (
    <View className="flex-1">
      <FlashList
        data={transactions}
        renderItem={({ item }) => <Runway {...{ item }} />}
        keyExtractor={(r) => r.id}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={50}
      />
    </View>
  );
}
