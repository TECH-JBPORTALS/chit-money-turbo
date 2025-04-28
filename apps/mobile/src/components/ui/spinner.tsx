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

const Spinner = ({ size = 50, color = "#ffffff", opacity = 0.6 }) => {
  const rotation = useSharedValue(360);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(-360, {
        duration: 5000,
        easing: Easing.linear,
      }),
      -1,
      true
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
          opacity={opacity}
          strokeWidth="2"
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
