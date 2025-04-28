import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { ScrollView } from "react-native-gesture-handler";
import {
  subscriberAddressInfoSchema,
  subscriberContactInfoSchema,
} from "@cmt/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryClient, trpc } from "~/utils/api";
import { SpinnerView } from "~/components/spinner-view";
import { notificationAsync, NotificationFeedbackType } from "expo-haptics";
import { toast } from "sonner-native";

const formSchema = subscriberContactInfoSchema.and(subscriberAddressInfoSchema);

export default function ContactDetails() {
  const client = useQueryClient(queryClient);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      const data = await client.fetchQuery(
        trpc.subscribers.getContactAddress.queryOptions()
      );

      return {
        primaryPhoneNumber: data.primaryPhoneNumber ?? "",
        secondaryPhoneNumber: data.secondaryPhoneNumber ?? "",
        addressLine: data.addressLine ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
        pincode: data.pincode ?? "",
      };
    },
  });

  const { mutateAsync: updateContactAddress } = useMutation(
    trpc.subscribers.updateContactAddress.mutationOptions({
      async onSuccess(data) {
        await notificationAsync(NotificationFeedbackType.Success);
        toast.success("Updated successfully");
        form.reset();
        client.invalidateQueries(trpc.subscribers.pathFilter());
      },
      async onError(error) {
        await notificationAsync(NotificationFeedbackType.Error);
        toast.error(error.message);
      },
    })
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateContactAddress(values);
  }

  if (form.formState.isLoading) return <SpinnerView />;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      automaticallyAdjustKeyboardInsets
      keyboardDismissMode="none"
      keyboardShouldPersistTaps
    >
      <View className="px-4 flex-1 py-6 gap-6">
        <Form {...form}>
          <FormField
            control={form.control}
            name="primaryPhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Phone Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChangeText={field.onChange}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Collectors try to contact first this
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secondaryPhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alternative Phone Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChangeText={field.onChange}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  In any case primary phone number not reach out
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addressLine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complete Address</FormLabel>
                <FormControl>
                  <Input {...field} onChangeText={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} onChangeText={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} onChangeText={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pincode</FormLabel>
                <FormControl>
                  <Input {...field} onChangeText={field.onChange} />
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
