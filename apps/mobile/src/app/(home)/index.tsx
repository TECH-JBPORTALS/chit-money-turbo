import { useAuth, useSession, useSignIn, useUser } from "@clerk/clerk-expo";
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
    <View className="px-5 py-6 gap-6">
      <Large>Hello {user?.emailAddresses.at(0)?.emailAddress}</Large>
      <Button
        onPress={async () => {
          setSigningOut(true);
          await signOut({ redirectUrl: "/sign-in" });
          setSigningOut(false);
        }}
        variant={"outline"}
        isLoading={isSigningOut}
      >
        <Text>Sign Out</Text>
      </Button>
    </View>
  );
}
