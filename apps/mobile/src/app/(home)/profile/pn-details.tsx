import { zodResolver } from "@hookform/resolvers/zod";
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
import { nomineeInfoSchema, personalInfoSchema } from "~/lib/validators";

const formSchema = z.object({
  personalInfo: personalInfoSchema,
  nomineeInfo: nomineeInfoSchema,
});

export default function PNDetails() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalInfo: {
        full_name: "",
        date_of_birth: "",
      },
      nomineeInfo: {
        full_name: "",
        relationship: "",
      },
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
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
            name="personalInfo.full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
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
            name="personalInfo.date_of_birth"
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
            name="nomineeInfo.full_name"
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
            name="nomineeInfo.relationship"
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
