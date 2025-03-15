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
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

const ContactInfoSchema = z.object({
  primary_phone_number: z
    .string()
    .trim()
    .min(10, "Phone number must be 10 digit")
    .max(10, "Phone number must be 10 digit"),
  contact_address: z.string().trim().min(4),
  contact_pincode: z.string().trim().min(6, "Invalid pincode"),
  contact_city: z.string().trim().min(1, "Required"),
  contact_state: z.string().trim().min(1, "Required"),
});

interface ContactInfoFormProps {
  next: () => void;
  prev: () => void;
  state: z.infer<typeof ContactInfoSchema>;
  setState: (key: keyof z.infer<typeof ContactInfoSchema>, value: any) => void;
}

export function ContactInfoForm({
  next,
  prev,
  setState,
  state,
}: ContactInfoFormProps) {
  const form = useForm<z.infer<typeof ContactInfoSchema>>({
    resolver: zodResolver(ContactInfoSchema),
    defaultValues: state,
  });

  const onSubmit = (values: z.infer<typeof ContactInfoSchema>) => {
    setState("primary_phone_number", values.primary_phone_number);
    setState("contact_address", values.contact_address);
    setState("contact_pincode", values.contact_pincode);
    setState("contact_city", values.contact_city);
    setState("contact_state", values.contact_state);
    next();
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Contact Information</CardTitle>
        <CardDescription>
          {
            "Give a proper valid information so there will be no problem to subscribers who may want’s to contact you"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="primary_phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+91" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="#123, 1st street ...." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full">
              Next <ArrowRightIcon />
            </Button>
            <Button
              type="button"
              onClick={prev}
              variant={"outline"}
              className="w-full"
            >
              <ArrowLeftIcon /> Back
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
