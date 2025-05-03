import { OTPInput, type SlotProps } from "input-otp-native";
import type { OTPInputRef } from "input-otp-native";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useSharedValue,
} from "react-native-reanimated";
import { cn } from "~/lib/utils";
import { Text } from "./text";
import { useEffect } from "react";

export function InputOTPGroup({
  children,
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      {...props}
      className={cn("flex-1 flex-row items-center justify-center", className)}
    >
      {children}
    </View>
  );
}

export function InputOTPSlot({
  char,
  isActive,
  hasFakeCaret,
  index,
}: SlotProps & { index: number }) {
  const isFirst = index === 0;
  const isLast = index === 2;
  return (
    <View
      className={cn(
        `w-12 h-16 items-center justify-center bg-input`,
        "border border-border",
        {
          "rounded-r-lg": isLast,
          "rounded-l-lg": isFirst,
          "bg-background border-primary": isActive,
        }
      )}
    >
      {char !== null && (
        <Text className="text-2xl font-medium text-muted-foreground">
          {char}
        </Text>
      )}
      {hasFakeCaret && <InputOTPCaret />}
    </View>
  );
}

export function InputOTPSeperator() {
  return (
    <View className="w-8 items-center justify-center">
      <View className="w-2 h-0.5 bg-muted-foreground rounded-sm" />
    </View>
  );
}

function InputOTPCaret() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const baseStyle = {
    width: 2,
    height: 32,
    borderRadius: 1,
  };

  return (
    <View className="absolute w-full h-full items-center justify-center">
      <Animated.View
        style={[baseStyle, animatedStyle]}
        className={"bg-primary"}
      />
    </View>
  );
}

export { OTPInput as InputOTP };
export type { OTPInputRef };
