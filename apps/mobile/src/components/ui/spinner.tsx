import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Loader } from "~/lib/icons/Loader";

const AnimatedLoader = Animated.createAnimatedComponent(Loader);

const Spinner = ({ ...props }: React.ComponentProps<typeof Loader>) => {
  const rotation = useSharedValue(360);
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(0, {
        duration: 600,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <AnimatedLoader
      {...props}
      strokeWidth={1.25}
      className={"text-foreground opacity-70"}
      animatedProps={animatedProps}
    />
  );
};

export default Spinner;
