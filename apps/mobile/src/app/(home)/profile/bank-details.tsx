import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
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
import { subscriberBankInfoSchema } from "@cmt/validators";
import { useQueryClient } from "@tanstack/react-query";
import { queryClient, trpc } from "~/utils/api";
import { SpinnerView } from "~/components/spinner-view";

export default function BankDetails() {
  const client = useQueryClient(queryClient);
  const form = useForm<z.infer<typeof subscriberBankInfoSchema>>({
    resolver: zodResolver(subscriberBankInfoSchema),
    defaultValues: async () => {
      const data = await client.fetchQuery(
        trpc.subscribers.getBankAccount.queryOptions()
      );

      return {
        accountHolderName: data?.accountHolderName ?? "",
        accountNumber: data?.accountNumber ?? "",
        accountType: data?.accountType ?? "",
        branchName: data?.branchName ?? "",
        city: data?.city ?? "",
        ifscCode: data?.ifscCode ?? "",
        pincode: data?.pincode ?? "",
        state: data?.state ?? "",
        upiId: data?.upiId ?? "",
      };
    },
  });

  async function onSubmit(values: z.infer<typeof subscriberBankInfoSchema>) {
    console.log(values);
  }

  if (form.formState.isLoading) return <SpinnerView />;

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
            name="accountNumber"
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
            name="accountHolderName"
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
            name="branchName"
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
            name="ifscCode"
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
            name="upiId"
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
            name="accountType"
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
