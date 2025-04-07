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
import { contactInfoSchema, addressInfoSchema } from "~/lib/validators";
import { ScrollView } from "react-native-gesture-handler";

const formSchema = z.object({
  contactInfo: contactInfoSchema,
  addressInfo: addressInfoSchema,
});

export default function ContactDetails() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactInfo: {
        primary_phone_number: "",
        alternative_phone_number: "",
      },
      addressInfo: {
        complete_address: "",
        pincode: "",
        city: "",
        state: "",
      },
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      automaticallyAdjustKeyboardInsets
      keyboardDismissMode="none"
    >
      <View className="px-4 flex-1 py-6 gap-6">
        <Form {...form}>
          <FormField
            control={form.control}
            name="contactInfo.primary_phone_number"
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
            name="contactInfo.alternative_phone_number"
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
            name="addressInfo.complete_address"
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
            name="addressInfo.city"
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
            name="addressInfo.state"
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
            name="addressInfo.pincode"
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
