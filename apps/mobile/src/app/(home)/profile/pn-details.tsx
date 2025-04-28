import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { DatePicker } from "~/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  notificationAsync,
  NotificationFeedbackType,
  selectionAsync,
} from "expo-haptics";
import { toast } from "sonner-native";

const formSchema = subscriberPersonalInfoSchema.and(nomineeInfoSchema);

const relationships = [
  { value: "Mother", label: "Mother" },
  { value: "Father", label: "Father" },
  { value: "Sister", label: "Sister" },
  { value: "Brother", label: "Brother" },
  { value: "Son", label: "Son" },
  { value: "Daughter", label: "Daughter" },
];

export default function PNDetails() {
  const client = useQueryClient(queryClient);
  const { mutateAsync: updatePersonalDetails } = useMutation(
    trpc.subscribers.updatePersonalDetails.mutationOptions({
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

  const insets = useSafeAreaInsets();

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom + 32,
    left: 12,
    right: 12,
  };

  async function onSubmit(input: z.infer<typeof formSchema>) {
    await updatePersonalDetails(input);
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
                  <DatePicker
                    value={new Date(field.value)}
                    onChange={(e, date) => {
                      field.onChange(date?.toDateString());
                    }}
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
                  <Select
                    defaultValue={relationships.find(
                      (v) => v.value === field.value
                    )}
                    onValueChange={(option) => {
                      selectionAsync();
                      field.onChange(option?.value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        className="text-foreground text-sm native:text-lg"
                        placeholder="Select"
                      />
                    </SelectTrigger>
                    <SelectContent
                      align="center"
                      insets={contentInsets}
                      className="w-full"
                    >
                      <SelectGroup>
                        <SelectLabel>Select Relationship</SelectLabel>

                        {relationships.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            label={option.label}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
