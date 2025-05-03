"use client";
import React from "react";
import { cn } from "@cmt/ui/lib/utils";
import { Button } from "@cmt/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cmt/ui/components/card";
import { Input } from "@cmt/ui/components/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@cmt/ui/components/input-otp";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@cmt/ui/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeClosedIcon, EyeIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import type { Invitation } from "@clerk/nextjs/server";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import Link from "next/link";

const signUpSchema = z
  .object({
    email: z.string().trim().min(1, {
      message: "Email address must be fill to continue.",
    }),
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
    .min(6, "Code must be equal to 6 digits")
    .max(6, "Code must be equal to 6 digits"),
});

export function SignUpForm({
  className,
  emailAddress,
  clerkTicket,
  ...props
}: React.ComponentProps<"div"> & {
  emailAddress?: Invitation["emailAddress"];
  clerkTicket?: string;
}) {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      email: emailAddress ?? "",
      password: "",
      confirm_password: "",
    },
  });

  const verificationForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  const { isLoaded, signUp, setActive } = useSignUp();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const [shouldVerify, setShouldVerify] = useState(false);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      if (isLoaded) {
        const auth = await signUp.create({
          ticket: clerkTicket,
          password: values.password,
          emailAddress: emailAddress ?? values.email,
          redirectUrl: redirectUrl ?? undefined,
        });

        if (auth.status === "missing_requirements") {
          await auth.prepareVerification({ strategy: "email_code" });
          setShouldVerify(true);
        }

        if (auth.status === "complete")
          form.setError("root", { message: "completed" });
      }
    } catch (e) {
      if (isClerkAPIResponseError(e)) {
        form.setError("root", { message: e.message });
      }
    }
  }

  async function onVerify(values: z.infer<typeof verificationSchema>) {
    try {
      if (isLoaded) {
        const auth = await signUp.attemptEmailAddressVerification({
          code: values.code,
        });

        if (auth.status === "complete") {
          await setActive?.({ session: auth.createdSessionId });
          router.refresh();
        }
      }
    } catch (e) {
      if (isClerkAPIResponseError(e)) {
        verificationForm.setError("root", { message: e.message });
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-transparent border-none shadow-none">
        {!shouldVerify ? (
          <React.Fragment>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Create an account</CardTitle>
              <CardDescription>
                Enter given below details to create your account
              </CardDescription>
              <p className="text-sm text-destructive">
                {form.formState.errors.root?.message}
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="flex flex-col gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="email">Email address</FormLabel>
                          <FormControl>
                            <Input
                              disabled={
                                form.formState.isSubmitting || !isLoaded
                              }
                              readOnly={!!clerkTicket}
                              className={cn(
                                clerkTicket && "bg-muted text-muted-foreground"
                              )}
                              placeholder="joe@example.com"
                              {...field}
                            />
                          </FormControl>
                          {clerkTicket && (
                            <FormDescription>
                              Account will be created for this email address.
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => {
                        const [eyeOpen, setEyeOpen] = useState(false);
                        return (
                          <FormItem>
                            <FormLabel htmlFor="password">
                              New Password
                            </FormLabel>
                            <FormControl>
                              <div className="inline-flex relative">
                                <Input
                                  disabled={
                                    form.formState.isSubmitting || !isLoaded
                                  }
                                  type={eyeOpen ? "text" : "password"}
                                  placeholder="•••••••••••••••••"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant={"ghost"}
                                  onClick={() => setEyeOpen(!eyeOpen)}
                                  className="absolute rounded-none right-0"
                                  size={"icon"}
                                >
                                  {eyeOpen ? (
                                    <EyeIcon className="text-muted-foreground" />
                                  ) : (
                                    <EyeClosedIcon className="text-muted-foreground" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="password">
                            Confirm password
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={
                                form.formState.isSubmitting || !isLoaded
                              }
                              type={"password"}
                              placeholder="•••••••••••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* CAPTCHA Widget */}
                  <div
                    id="clerk-captcha"
                    data-cl-theme="dark"
                    data-cl-size="flexible"
                  ></div>

                  <div className="flex flex-col gap-3">
                    <Button
                      disabled={form.formState.isSubmitting || !isLoaded}
                      type="submit"
                      className="w-full"
                    >
                      {form.formState.isSubmitting ? (
                        <Loader2Icon className="animate-spin" />
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>

                  {!clerkTicket && (
                    <div className="text-sm  text-center">
                      Already have an account?{" "}
                      <Link
                        href={"/sign-in"}
                        className="text-primary hover:underline"
                      >
                        Sign in
                      </Link>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                Verification of Email address
              </CardTitle>
              <CardDescription>
                Enter the code sent to your email
              </CardDescription>
              <p className="text-sm text-destructive">
                {verificationForm.formState.errors.root?.message}
              </p>
            </CardHeader>

            <CardContent>
              <Form key={"Verification"} {...verificationForm}>
                <form
                  onSubmit={verificationForm.handleSubmit(onVerify)}
                  className="space-y-8"
                >
                  <div className="flex flex-col gap-6">
                    <FormField
                      control={verificationForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem className="items-center flex flex-col">
                          <FormLabel htmlFor="code">One Time Code</FormLabel>
                          <FormControl>
                            <InputOTP
                              maxLength={6}
                              className={cn(
                                clerkTicket && "bg-muted text-muted-foreground"
                              )}
                              {...field}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          {clerkTicket && (
                            <FormDescription>
                              Account will be created for this email address{" "}
                              {form.getValues().email}.
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* CAPTCHA Widget */}
                  <div
                    id="clerk-captcha"
                    data-cl-theme="dark"
                    data-cl-size="flexible"
                  ></div>

                  <div className="flex flex-col gap-3">
                    <Button
                      disabled={
                        verificationForm.formState.isSubmitting || !isLoaded
                      }
                      type="submit"
                      className="w-full"
                    >
                      {verificationForm.formState.isSubmitting ? (
                        <Loader2Icon className="animate-spin" />
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>

                  <div className="text-sm  text-center">
                    Email address is misspelled?{" "}
                    <Button
                      variant={"link"}
                      size={"sm"}
                      onClick={() => setShouldVerify(false)}
                    >
                      Change
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </React.Fragment>
        )}
      </Card>
    </div>
  );
}
