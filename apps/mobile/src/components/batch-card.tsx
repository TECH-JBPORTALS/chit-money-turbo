import { View } from "react-native";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import React from "react";
import { cn } from "~/lib/utils";

export const BatchCard = Card;

export const BatchCardHeader = ({
  className,
  ...props
}: React.ComponentProps<typeof CardContent>) => (
  <CardContent
    className={cn("pt-4 items-center px-6 flex-row gap-8 pb-2", className)}
    {...props}
  />
);

export const BatchCardTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof CardTitle>) => (
  <CardTitle className={cn("text-base", className)} {...props} />
);

export const BatchCardBadgeRow = ({
  className,
  ...props
}: React.ComponentProps<typeof View>) => (
  <View className={cn("flex-row gap-2", className)} {...props} />
);

export const BatchCardBadge = ({
  variant = "secondary",
  ...props
}: React.ComponentProps<typeof Badge>) => (
  <Badge variant={variant} {...props}></Badge>
);

export const BatchCardContent = ({
  className,
  ...props
}: React.ComponentProps<typeof CardHeader>) => (
  <CardHeader className={cn("pt-0 gap-2", className)} {...props} />
);

export const BatchCardFooter = CardFooter;
