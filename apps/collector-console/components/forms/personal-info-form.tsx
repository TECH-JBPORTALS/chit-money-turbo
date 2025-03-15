"use client";

import { Input } from "@cmt/ui/components/input";
import { Button } from "@cmt/ui/components/button";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cmt/ui/components/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@cmt/ui/components/form";
import { ArrowRightIcon } from "lucide-react";
import { useSteps } from "react-step-builder";

const personalInfoSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters long"),
  last_name: z.string().trim(),
  date_of_birth: z.string().min(1),
});

interface PersonalInfoFormProps {
  next: () => void;
  state: z.infer<typeof personalInfoSchema>;
  setState: (key: keyof z.infer<typeof personalInfoSchema>, value: any) => void;
}

export function PersonalInfoForm({
  setState,
  state,
  next,
}: PersonalInfoFormProps) {
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: state,
  });

  const onSubmit = (values: z.infer<typeof personalInfoSchema>) => {
    setState("first_name", values.first_name);
    setState("last_name", values.last_name);
    setState("date_of_birth", values.date_of_birth);
    next();
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Personal Information </CardTitle>
        <CardDescription>Should match with your address proof</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ravi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Kiran" {...field} />
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
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" placeholder="Jhon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full">
              Next <ArrowRightIcon />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
