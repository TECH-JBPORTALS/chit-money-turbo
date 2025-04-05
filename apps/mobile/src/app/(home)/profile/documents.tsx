import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { openSettings } from "expo-linking";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { documentsSchema } from "~/lib/validators";
import { RotateCcw } from "~/lib/icons/RotateCcw";
import { Camera } from "~/lib/icons/Camera";
import { getUTPublicUrl, useUploadHelpers } from "~/utils/uploadthing";
import { ScrollView } from "react-native-gesture-handler";

export default function Documents() {
  const form = useForm<z.infer<typeof documentsSchema>>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      pan_number: "",
      aadhar_uri: "",
    },
  });
  const { useImageUploader } = useUploadHelpers();
  const { openImagePicker, isUploading } = useImageUploader("imageUploader", {
    onClientUploadComplete: (res) => {
      form.setValue("aadhar_uri", res.at(0)?.key ?? "");
    },
    onUploadError: (error) => {
      console.log(error);
      Alert.alert("Upload Error", error.message, undefined, {
        userInterfaceStyle: "dark",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof documentsSchema>) {
    console.log(values);
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="px-4 flex-1 py-6 gap-6">
        <Form {...form}>
          <FormField
            control={form.control}
            name="pan_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PAN Number</FormLabel>
                <FormControl>
                  <Input {...field} autoFocus onChangeText={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aadhar_uri"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aadhar Card</FormLabel>
                <FormControl>
                  {field.value ? (
                    <>
                      <Image
                        source={{ uri: getUTPublicUrl(field.value) }}
                        style={{ width: "auto", height: 200, borderRadius: 6 }}
                      />
                      <Button
                        isLoading={isUploading}
                        onPress={() => {
                          openImagePicker({
                            allowsEditing: true,
                            source: "camera", // or "camera"
                            onInsufficientPermissions: () => {
                              Alert.alert(
                                "No Permissions",
                                "You need to grant permission to your Photos to use this",
                                [
                                  { text: "Dismiss" },
                                  {
                                    text: "Open Settings",
                                    onPress: openSettings,
                                  },
                                ],
                                { userInterfaceStyle: "dark" }
                              );
                            },
                          });
                        }}
                        size={"lg"}
                        variant={"outline"}
                      >
                        <RotateCcw className="size-5 text-secondary-foreground" />
                        <Text>Re-Capture Image</Text>
                      </Button>
                    </>
                  ) : (
                    <Button
                      isLoading={isUploading}
                      onPress={() => {
                        openImagePicker({
                          allowsEditing: true,
                          source: "camera", // or "camera"
                          onInsufficientPermissions: () => {
                            Alert.alert(
                              "No Permissions",
                              "You need to grant permission to your Photos to use this",
                              [
                                { text: "Dismiss" },
                                {
                                  text: "Open Settings",
                                  onPress: openSettings,
                                },
                              ],
                              { userInterfaceStyle: "dark" }
                            );
                          },
                        });
                      }}
                      size={"lg"}
                      variant={"outline"}
                    >
                      <Camera className="size-5 text-secondary-foreground" />
                      <Text>Capture Image</Text>
                    </Button>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full"
            disabled={!form.formState.isDirty}
            isLoading={form.formState.isSubmitting}
            onPress={form.handleSubmit(onSubmit)}
          >
            <Text>Update Details</Text>
          </Button>
        </Form>
      </View>
    </ScrollView>
  );
}
