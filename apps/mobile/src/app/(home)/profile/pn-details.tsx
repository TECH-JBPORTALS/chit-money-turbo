import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
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
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { Large } from "~/components/ui/typography";
import {
  nomineeInfoSchema,
  subscriberPersonalInfoSchema,
} from "@cmt/validators";
import { queryClient, trpc } from "~/utils/api";
import { SpinnerView } from "~/components/spinner-view";

const formSchema = subscriberPersonalInfoSchema.and(nomineeInfoSchema);

export default function PNDetails() {
  const client = useQueryClient(queryClient);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      const data = await client.fetchQuery(
        trpc.subscribers.getPersonalDetails.queryOptions()
      );

      return {
        firstName: data?.firstName ?? "",
        lastName: data?.lastName ?? "",
        dateOfBirth: data?.dateOfBirth ?? "",
        nomineeName: data?.nomineeName ?? "",
        nomineeRelationship: data?.nomineeRelationship ?? "",
      };
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
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
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChangeText={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  {"It's only uses for display and record purpose"}
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChangeText={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  {"It's only uses for display and record purpose"}
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Of Birth</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChangeText={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  {"Should be as it is on the address proof"}
                </FormDescription>
              </FormItem>
            )}
          />

          <Separator />

          <Large>Nominee Details</Large>

          <FormField
            control={form.control}
            name="nomineeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nominee Full Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChangeText={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  {"will get your previllage in your absent"}
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nomineeRelationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nominee Relationship</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChangeText={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={!form.formState.isDirty}
            isLoading={form.formState.isSubmitting}
            className="w-full"
            onPress={form.handleSubmit(onSubmit)}
          >
            <Text>Update Details</Text>
          </Button>
        </Form>
      </View>
    </ScrollView>
  );
}
