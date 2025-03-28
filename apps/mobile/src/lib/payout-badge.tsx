import { Badge } from "~/components/ui/badge";
import { Text } from "~/components/ui/text";

export function PayoutStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "requested":
      return (
        <Badge className="bg-orange-600">
          <Text>Requested</Text>
        </Badge>
      );

    case "approved":
      return (
        <Badge className="bg-indigo-600">
          <Text>Approved</Text>
        </Badge>
      );

    case "disbursed":
      return (
        <Badge>
          <Text>Disbursed</Text>
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant={"destructive"}>
          <Text>Rejected</Text>
        </Badge>
      );

    case "cancelled":
      return (
        <Badge variant={"outline"} className="border-destructive">
          <Text className="text-destructive">Cancelled</Text>
        </Badge>
      );
  }
}
