"use client";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@cmt/ui/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { EyeClosedIcon, EyeIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

const signInSchema = z.object({
  email: z.string().trim().min(1, {
    message: "Email address must be fill to continue.",
  }),
  password: z.string().trim().min(1, {
    message: "Password must be fill to continue.",
  }),
});

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isLoaded, signIn, setActive } = useSignIn();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    try {
      if (isLoaded) {
        const { createdSessionId, status } = await signIn.create({
          password: values.password,
          identifier: values.email,
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
          <CardTitle className="text-xl">Sign in to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
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
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    disabled={form.formState.isSubmitting || !isLoaded}
                    render={({ field }) => {
                      const [eyeOpen, setEyeOpen] = useState(false);
                      return (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <a
                              href="#"
                              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                            >
                              Forgot your password?
                            </a>
                          </div>
                          <FormControl>
                            <div className="inline-flex overflow-hidden relative">
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
                </div>
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
