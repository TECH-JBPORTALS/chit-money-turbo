import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import React from "react";
import { Muted, P, Small } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClerkAPIError } from "@clerk/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

const signInSchema = z.object({
  email: z.string().trim().min(1, {
    message: "Email address must be fill to continue.",
  }),
  password: z.string().trim().min(1, {
    message: "Password must be fill to continue.",
  }),
});

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle the submission of the sign-in form
  async function onSubmit(values: z.infer<typeof signInSchema>) {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      const clerkError = err as ClerkAPIError;
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log(JSON.stringify(clerkError, null, 2));

      form.setError("root", { message: clerkError.longMessage });
    }
  }

  return (
    <ScrollView
      contentContainerClassName="items-center gap-6 px-5 py-6"
      keyboardShouldPersistTaps={"handled"}
    >
      <Muted className="text-center w-4/5">
        Continue signing in to your profile by filling given below details.
      </Muted>
      <Form {...form}>
        {form.formState.errors.root?.message && (
          <Small className="text-destructive">
            {form.formState.errors.root.message}
          </Small>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel htmlFor="email">Email address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  editable={!form.formState.isSubmitting || isLoaded}
                  autoCapitalize="none"
                  onChangeText={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <View className="flex-row items-center justify-between">
                <FormLabel htmlFor="email">Password</FormLabel>
                <Link href="/sign-up">
                  <Muted className="text-primary">forgot password?</Muted>
                </Link>
              </View>
              <FormControl>
                <Input
                  {...field}
                  editable={!form.formState.isSubmitting || isLoaded}
                  autoCapitalize="none"
                  onChangeText={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" onPress={form.handleSubmit(onSubmit)}>
          <Text>Continue</Text>
        </Button>
      </Form>
      <View className="flex-row items-center gap-2">
        <P>Don't have an account?</P>
        <Link href="/sign-up" replace>
          <P className="text-primary">Create Account</P>
        </Link>
      </View>
    </ScrollView>
  );
}
