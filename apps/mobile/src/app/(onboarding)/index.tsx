import React, { useEffect } from "react";
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
import {
  personalInfoSchema,
  contactInfoSchema,
  nomineeInfoSchema,
  documentsSchema,
} from "~/lib/validators";
import { useOnboardingStore } from "~/lib/hooks/useOnboardingStore";

function PersonalInfoForm() {
  const {
    setState,
    state: { personalInfo, ...state },
  } = useOnboardingStore();
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo,
  });

  const { next } = useFormSteps();

  async function onSubmit(values: z.infer<typeof personalInfoSchema>) {
    setState({ ...state, personalInfo: values });
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

function ContactInfoForm() {
  const {
    setState,
    state: { contactInfo, ...state },
  } = useOnboardingStore();
  const form = useForm<z.infer<typeof contactInfoSchema>>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: contactInfo,
  });
  const { next, prev } = useFormSteps();

  async function onSubmit(values: z.infer<typeof contactInfoSchema>) {
    setState({ ...state, contactInfo: values });
    next();
  }

  return (
    <View className="flex-1 gap-6">
      <Form {...form}>
        <FormField
          control={form.control}
          name="primary_phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Phone Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  onChangeText={field.onChange}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alternative_phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Of Birth</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChangeText={field.onChange}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
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
        >
          <Text>Next</Text>
          <ArrowRight className="size-4 text-primary-foreground" />
        </Button>
      </View>
    </View>
  );
}

function NomineeInfoForm() {
  const {
    setState,
    state: { nomineeInfo, ...state },
  } = useOnboardingStore();
  const form = useForm<z.infer<typeof nomineeInfoSchema>>({
    resolver: zodResolver(nomineeInfoSchema),
    defaultValues: nomineeInfo,
  });
  const { next, prev } = useFormSteps();

  async function onSubmit(values: z.infer<typeof nomineeInfoSchema>) {
    setState({ ...state, nomineeInfo: values });
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
                <Input {...field} autoFocus onChangeText={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship</FormLabel>
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
        >
          <Text>Next</Text>
          <ArrowRight className="size-4 text-primary-foreground" />
        </Button>
      </View>
    </View>
  );
}

function DocumentsForm() {
  const {
    setState,
    state: { documents, ...state },
  } = useOnboardingStore();
  const form = useForm<z.infer<typeof documentsSchema>>({
    resolver: zodResolver(documentsSchema),
    defaultValues: documents,
  });
  const { next, prev } = useFormSteps();

  async function onSubmit(values: z.infer<typeof documentsSchema>) {
    setState({ ...state, documents: values });
    next();
  }

  return (
    <View className="flex-1 gap-6">
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
                <Button variant={"outline"}>
                  <Text>Upload or Capture</Text>
                </Button>
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
  const { currentStep: defaultStep, setCurrentStep } = useOnboardingStore();
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
      <FormSteps
        onStepChange={(step) => {
          setCurrentStep(step);
        }}
        defaultStep={defaultStep}
      >
        <PersonalInfoForm />
        <ContactInfoForm />
        <DocumentsForm />
        <NomineeInfoForm />
        <ContactInfoForm />
        <ContactInfoForm />
      </FormSteps>
    </LinearBlurView>
  );
}
