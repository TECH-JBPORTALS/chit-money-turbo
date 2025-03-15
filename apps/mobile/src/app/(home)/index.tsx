import { useAuth, useSession, useSignIn, useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Large } from "~/components/ui/typography";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isSigningOut, setSigningOut] = useState(false);

  return (
    <View className="px-5 py-6 items-center gap-6">
      <Image
        source={{ uri: user?.imageUrl }}
        style={{ width: 64, height: 64, borderRadius: 9999 }}
      />
      <Large>Hello {user?.emailAddresses.at(0)?.emailAddress}</Large>
      <Button
        onPress={async () => {
          setSigningOut(true);
          await signOut({ redirectUrl: "/sign-in" });
          setSigningOut(false);
        }}
        variant={"outline"}
        className="w-full"
        isLoading={isSigningOut}
      >
        <Text>Sign Out</Text>
      </Button>
    </View>
  );
}
