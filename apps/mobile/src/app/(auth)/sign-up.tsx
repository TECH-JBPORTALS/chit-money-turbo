import * as React from "react";
import { ScrollView, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
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

const signUpSchema = z
  .object({
    email: z.string().trim().email().min(1, {
      message: "Email address must be fill to continue.",
    }),
    //:TODO
    // first_name: z.string().trim().min(1, {
    //   message: "Required",
    // }),
    // last_name: z.string().trim().min(1, {
    //   message: "Required",
    // }),
    password: z.string().trim().min(1, {
      message: "Password must be fill to continue.",
    }),
    confirm_password: z.string().trim().min(1, {
      message: "Confirm the password to continue.",
    }),
  })
  .refine((s) => s.password === s.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

const verificationSchema = z.object({
  code: z
    .string()
    .trim()
    .min(6, {
      message: "Code must be 6 digit number",
    })
    .max(6, {
      message: "Code must be 6 digit number",
    }),
});

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
  });
  const verificationForm = useForm({
    resolver: zodResolver(verificationSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });
  const [pendingVerification, setPendingVerification] = React.useState(false);

  // Handle submission of sign-up form
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      const clerkError = err as any;
      console.warn(JSON.stringify(clerkError, null, 2));
      form.setError("root", { message: clerkError.errors.at(0)?.longMessage });
    }
  }

  // Handle submission of verification form
  async function onVerifyPress({ code }: z.infer<typeof verificationSchema>) {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      const clerkError = err as any;
      console.warn(JSON.stringify(clerkError, null, 2));
      verificationForm.setError("root", {
        message: clerkError.errors.at(0)?.longMessage,
      });
    }
  }

  if (pendingVerification) {
    return (
      <View className="items-center gap-6  px-5 py-6">
        <Form {...verificationForm}>
          <Muted>6 digit code has been sent your email address</Muted>
          {verificationForm.formState.errors.root?.message && (
            <Small className="text-destructive">
              {verificationForm.formState.errors.root.message}
            </Small>
          )}
          <FormField
            control={verificationForm.control}
            name="code"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    autoFocus
                    editable={
                      !verificationForm.formState.isSubmitting || isLoaded
                    }
                    keyboardType="number-pad"
                    textAlign="center"
                    className="native:text-xl font-bold text-primary"
                    onChangeText={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full"
            isLoading={verificationForm.formState.isSubmitting}
            onPress={verificationForm.handleSubmit(onVerifyPress)}
          >
            <Text>Verify</Text>
          </Button>
        </Form>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerClassName="items-center gap-6  px-5 py-6"
      keyboardShouldPersistTaps={"handled"}
    >
      <Muted className="text-center w-4/5">
        Continue creating your profile by verifying your email address.
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
                  placeholder="name@yourdomain.com"
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
              <FormLabel htmlFor="email">Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  secureTextEntry
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
          name="confirm_password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel htmlFor="email">Confirm Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  secureTextEntry
                  editable={!form.formState.isSubmitting || isLoaded}
                  autoCapitalize="none"
                  onChangeText={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full"
          isLoading={form.formState.isSubmitting}
          onPress={form.handleSubmit(onSubmit)}
        >
          <Text>Continue</Text>
        </Button>
      </Form>
      <View className="flex-row items-center gap-2">
        <P>Already have an account?</P>
        <Link href="/sign-in" replace>
          <P className="text-primary">Sign In</P>
        </Link>
      </View>
    </ScrollView>
  );
}
