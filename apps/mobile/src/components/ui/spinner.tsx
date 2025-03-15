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

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Spinner = ({ size = 50, color = "#ffffff" }) => {
  const rotation = useSharedValue(360);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(-360, { duration: 2000, easing: Easing.linear }),
      -1
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: rotation.value,
  }));

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Svg width={size} height={size} viewBox="0 0 50 50">
        <AnimatedCircle
          cx="25"
          cy="25"
          r="20"
          stroke={color}
          strokeWidth="5"
          fill="none"
          strokeDasharray="100"
          strokeLinecap="round"
          animatedProps={animatedProps}
        />
      </Svg>
    </View>
  );
};

export default Spinner;
