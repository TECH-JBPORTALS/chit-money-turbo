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

const signInSchema = z
  .object({
    email: z.string().trim().min(1, {
      message: "Email address must be fill to continue.",
    }),
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

export function SignUpForm({
  className,
  email,
  clerkTicket,
  ...props
}: React.ComponentProps<"div"> & {
  email: Invitation["emailAddress"];
  clerkTicket: string;
}) {
  const form = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email,
      password: "",
      confirm_password: "",
    },
  });

  const { isLoaded, signUp, setActive } = useSignUp();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    try {
      if (isLoaded) {
        const { createdSessionId, status } = await signUp.create({
          ticket: clerkTicket,
          password: values.password,
          strategy: "ticket",
          // firstName: values.first_name,
          // lastName: values.last_name,
          redirectUrl: redirectUrl ?? undefined,
        });

        if (status === "complete") {
          setActive({ session: createdSessionId });
          router.refresh();
        }
      }
    } catch (e) {
      console.log(e);
      form.setError("root", { message: "Email or password is incorrect" });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-transparent border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Complete Your Account Creation
          </CardTitle>
          <CardDescription>Enter given below details to signup</CardDescription>
          <p className="text-sm text-destructive text-sm">
            {form.formState.errors.root?.message}
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  disabled={form.formState.isSubmitting || !isLoaded}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email address</FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          className="bg-muted text-muted-foreground"
                          placeholder="No email found"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Account will be created for this email address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <div className="grid grid-col-2 grid-flow-row gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    disabled={form.formState.isSubmitting || !isLoaded}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="first_name">First Name</FormLabel>
                        <FormControl>
                          <Input type={"text"} placeholder="Luca" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    disabled={form.formState.isSubmitting || !isLoaded}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="first_name">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            type={"text"}
                            placeholder="Charagetta"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */}

                <FormField
                  control={form.control}
                  name="password"
                  disabled={form.formState.isSubmitting || !isLoaded}
                  render={({ field }) => {
                    const [eyeOpen, setEyeOpen] = useState(false);
                    return (
                      <FormItem>
                        <FormLabel htmlFor="password">New Password</FormLabel>
                        <FormControl>
                          <div className="inline-flex relative">
                            <Input
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
                  disabled={form.formState.isSubmitting || !isLoaded}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Confirm password</FormLabel>
                      <FormControl>
                        <Input
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
                    "Continue"
                  )}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                By clicking continue, you agree to our Terms of Service and
                Privacy Policy.
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
