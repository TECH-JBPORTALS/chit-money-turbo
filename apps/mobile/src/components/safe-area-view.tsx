import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function SafeAreaView({
  children,
  style,
  ...props
}: React.ComponentProps<typeof View>) {
  const insets = useSafeAreaInsets();

  return (
    <View {...props} style={[{ paddingTop: insets.top, flex: 1 }, style]}>
      {children}
    </View>
  );
}
