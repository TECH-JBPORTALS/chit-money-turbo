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
import { RotateCcw } from "~/lib/icons/RotateCcw";
import { Camera } from "~/lib/icons/Camera";
import { getUTPublicUrl, useUploadHelpers } from "~/utils/uploadthing";
import { ScrollView } from "react-native-gesture-handler";
import { subscriberDocumentsSchema } from "@cmt/validators";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryClient, trpc } from "~/utils/api";
import { SpinnerView } from "~/components/spinner-view";
import { notificationAsync, NotificationFeedbackType } from "expo-haptics";
import { toast } from "sonner-native";

export default function Documents() {
  const client = useQueryClient(queryClient);

  const { mutateAsync: updateDocuments } = useMutation(
    trpc.subscribers.updateDocuments.mutationOptions({
      async onSuccess(data) {
        await notificationAsync(NotificationFeedbackType.Success);
        toast.success("Updated successfully");
        client.invalidateQueries(trpc.subscribers.pathFilter());
      },
      async onError(error) {
        await notificationAsync(NotificationFeedbackType.Error);
        toast.error(error.message);
      },
    })
  );

  const form = useForm<z.infer<typeof subscriberDocumentsSchema>>({
    resolver: zodResolver(subscriberDocumentsSchema),
    defaultValues: async () => {
      const data = await client.fetchQuery(
        trpc.subscribers.getDocuments.queryOptions()
      );
      return {
        panCardNumber: data?.panCardNumber ?? "",
        aadharBackFileKey: data?.aadharBackFileKey ?? "",
        aadharFrontFileKey: data?.aadharFrontFileKey ?? "",
      };
    },
  });
  const { useImageUploader } = useUploadHelpers();

  const {
    openImagePicker: aadharFrontImagePicker,
    isUploading: isAadharFrontImageUploading,
  } = useImageUploader("imageUploader", {
    onClientUploadComplete: (res) => {
      form.setValue("aadharFrontFileKey", res.at(0)?.key ?? "", {
        shouldDirty: true,
      });
    },
    onUploadError: (error) => {
      console.log(error);
      Alert.alert("Upload Error", error.message, undefined, {
        userInterfaceStyle: "dark",
      });
    },
  });

  const {
    openImagePicker: aadharBackImagePicker,
    isUploading: isAadharBackImageUploading,
  } = useImageUploader("imageUploader", {
    onClientUploadComplete: (res) => {
      form.setValue("aadharBackFileKey", res.at(0)?.key ?? "", {
        shouldDirty: true,
      });
    },
    onUploadError: (error) => {
      console.log(error);
      Alert.alert("Upload Error", error.message, undefined, {
        userInterfaceStyle: "dark",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof subscriberDocumentsSchema>) {
    await updateDocuments(values);
  }

  if (form.formState.isLoading) return <SpinnerView />;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="px-4 flex-1 py-6 gap-6">
        <Form {...form}>
          <FormField
            control={form.control}
            name="panCardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PAN Number</FormLabel>
                <FormControl>
                  <Input {...field} onChangeText={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aadharFrontFileKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Aadhar Card Photo (front)"}</FormLabel>
                <FormControl>
                  {field.value ? (
                    <React.Fragment>
                      <Image
                        source={{ uri: getUTPublicUrl(field.value) }}
                        style={{ width: "auto", height: 200, borderRadius: 6 }}
                        alt={field.value}
                      />
                      <Button
                        isLoading={isAadharFrontImageUploading}
                        onPress={() => {
                          aadharFrontImagePicker({
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
                    </React.Fragment>
                  ) : (
                    <Button
                      isLoading={isAadharFrontImageUploading}
                      onPress={() => {
                        aadharFrontImagePicker({
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

          <FormField
            control={form.control}
            name="aadharBackFileKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Aadhar Card Photo (back)"}</FormLabel>
                <FormControl>
                  {field.value ? (
                    <React.Fragment>
                      <Image
                        source={{ uri: getUTPublicUrl(field.value) }}
                        style={{ width: "auto", height: 200, borderRadius: 6 }}
                      />
                      <Button
                        isLoading={isAadharBackImageUploading}
                        onPress={() => {
                          aadharBackImagePicker({
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
                    </React.Fragment>
                  ) : (
                    <Button
                      isLoading={isAadharBackImageUploading}
                      onPress={() => {
                        aadharBackImagePicker({
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
