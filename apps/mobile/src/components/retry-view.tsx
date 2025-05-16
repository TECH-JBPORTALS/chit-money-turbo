import React from "react";
import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { cn } from "~/lib/utils";
import { TriangleAlert } from "~/lib/icons/TriangleAlert";
import { Large, Muted } from "./ui/typography";
import { Button } from "./ui/button";

export function RetryView({
  children,
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View
      {...props}
      className={cn(
        "flex-1 items-center px-10 pb-20 justify-center gap-3",
        className
      )}
    >
      {children}
    </View>
  );
}

export function RetryViewIcon() {
  return (
    <Animated.View entering={FadeInDown.duration(360).springify()}>
      <TriangleAlert
        size={48}
        strokeWidth={1.25}
        className="text-muted-foreground"
      />
    </Animated.View>
  );
}

export function RetryViewTitle({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Large>) {
  return (
    <Large {...props} className={cn("text-center", className)}>
      {children ?? "Something Went Wrong !"}
    </Large>
  );
}

export function RetryViewDescription({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Muted>) {
  return (
    <Muted {...props} className={cn("text-center", className)}>
      {children ?? "Something Went Wrong !"}
    </Muted>
  );
}

export function RetryViewButton({
  size = "sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  return <Button {...props} size={size} />;
}
