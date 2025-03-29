import React from "react";
import { Text } from "~/components/ui/text";
import { Stack } from "expo-router";
import { LinearBlurView } from "~/components/linear-blurview";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { ArrowRight } from "~/lib/icons/ArrowRight";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { Button } from "~/components/ui/button";
import { View } from "react-native";
import { FormSteps, useFormSteps } from "~/components/form-steps";
import { Small } from "~/components/ui/typography";

const personalInfoSchema = z.object({
  full_name: z.string().trim().min(2, "Enter valid name"),
  date_of_birth: z.string().trim().min(2, "Enter valid date of birth"),
});

function PersonalInfoForm() {
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      full_name: "",
      date_of_birth: "",
    },
  });
  const { next } = useFormSteps();

  async function onSubmit(values: z.infer<typeof personalInfoSchema>) {
    next();
  }

  return (
    <View className="flex-1 gap-6">
      <Form {...form}>
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  onChangeText={field.onChange}
                  placeholder="Gean Gun Hi"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_of_birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Of Birth</FormLabel>
              <FormControl>
                <Input {...field} onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
      <Button
        onPress={form.handleSubmit(onSubmit)}
        size={"lg"}
        className="mt-auto"
      >
        <Text>Next</Text>
        <ArrowRight className="size-4 text-primary-foreground" />
      </Button>
    </View>
  );
}

const contactInfoSchema = z.object({
  full_name: z.string().trim().min(2, "Enter valid name"),
  date_of_birth: z.string().trim().min(2, "Enter valid date of birth"),
});
function ContactInfoForm() {
  const form = useForm<z.infer<typeof contactInfoSchema>>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      full_name: "",
      date_of_birth: "",
    },
  });
  const { next, prev } = useFormSteps();

  async function onSubmit(values: z.infer<typeof contactInfoSchema>) {
    next();
  }

  return (
    <View className="flex-1 gap-6">
      <Form {...form}>
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  onChangeText={field.onChange}
                  placeholder="Gean Gun Hi"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_of_birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Of Birth</FormLabel>
              <FormControl>
                <Input {...field} onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      <View className="flex-row gap-4 mt-auto">
        <Button
          onPress={() => prev()}
          size={"lg"}
          variant={"secondary"}
          className="flex-1"
        >
          <ArrowLeft className="size-4 text-secondary-foreground" />
          <Text>Back</Text>
        </Button>
        <Button
          onPress={form.handleSubmit(onSubmit)}
          size={"lg"}
          className="flex-1"
          disabled={!form.formState.isValid}
        >
          <Text>Next</Text>
          <ArrowRight className="size-4 text-primary-foreground" />
        </Button>
      </View>
    </View>
  );
}

export default function Index() {
  const { currentStep, totalSteps } = useFormSteps();
  const labels = [
    "Personal Information",
    "Contact Information",
    "Documents",
    "Nominee Details",
    "Address Details",
    "Bank Account Details",
  ];

  return (
    <LinearBlurView className="pt-20">
      <Stack.Screen
        options={{
          title: labels[currentStep - 1],
          headerShown: true,
          headerTitleStyle: {
            fontFamily: "Urbanist_400Regular",
          },
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerTransparent: true,
          headerRight: () => (
            <Small>
              {currentStep}/{totalSteps}
            </Small>
          ),
        }}
      />
      <FormSteps defaultStep={1}>
        <PersonalInfoForm />
        <ContactInfoForm />
        <ContactInfoForm />
        <ContactInfoForm />
        <ContactInfoForm />
        <ContactInfoForm />
      </FormSteps>
    </LinearBlurView>
  );
}
