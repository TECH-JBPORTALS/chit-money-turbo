import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { bankInfoSchema } from "~/lib/validators";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import {
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  Form,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function BankDetails() {
  const form = useForm<z.infer<typeof bankInfoSchema>>({
    resolver: zodResolver(bankInfoSchema),
    defaultValues: {
      account_number: "",
      confirm_account_number: "",
      account_holder_name: "",
      ifsc_code: "",
      branch_name: "",
      upi_id: "",
      account_type: "",
    },
  });

  async function onSubmit(values: z.infer<typeof bankInfoSchema>) {
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
            name="account_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input {...field} onChangeText={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_account_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Account Number</FormLabel>
                <FormControl>
                  <Input {...field} onChangeText={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="account_holder_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Holder Name</FormLabel>
                <FormControl>
                  <Input {...field} onChangeText={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="branch_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch Name</FormLabel>
                <FormControl>
                  <Input {...field} onChangeText={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ifsc_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IFSC Code</FormLabel>
                <FormControl>
                  <Input {...field} onChangeText={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="upi_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UPI Id</FormLabel>
                <FormControl>
                  <Input {...field} onChangeText={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="account_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
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
