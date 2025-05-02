import React from "react";
import { View } from "react-native";
import { Search } from "~/lib/icons/Search";
import { Input } from "./ui/input";

export default function SearchInput({
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <View className="relative flex-row items-center">
      <Search className="absolute z-30 ml-3.5 mr-3.5 size-5 text-muted-foreground" />
      <Input
        {...props}
        placeholder="Search..."
        placeholderClassName="text-sm"
        className="ps-10 w-full native:h-14"
      />
    </View>
  );
}
