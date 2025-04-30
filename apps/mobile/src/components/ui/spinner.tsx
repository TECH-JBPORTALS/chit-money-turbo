import React, { useEffect } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { CircleDivide } from "~/lib/icons/CircleDivide";

const AnimatedCircle = Animated.createAnimatedComponent(CircleDivide);

const Spinner = ({ ...props }: React.ComponentProps<typeof CircleDivide>) => {
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 600,
        easing: Easing.linear,
      })
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <AnimatedCircle
      {...props}
      strokeWidth={1.25}
      className={"text-foreground opacity-70"}
      animatedProps={animatedProps}
    />
  );
};

export default Spinner;
