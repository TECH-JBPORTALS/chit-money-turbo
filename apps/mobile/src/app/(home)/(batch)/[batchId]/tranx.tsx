import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function Tranx() {
  return (
    <View className="flex-1">
      <Text>Tranx</Text>
      <Button
        onPress={() => {
          console.log("Hello");
        }}
      >
        <Text>Hello</Text>
      </Button>
    </View>
  );
}
