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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@cmt/ui/components/form";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { StepProps, StepWithPrevProps } from "@/types/step-form";

const personalInfoSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters long"),
  last_name: z.string().trim(),
  date_of_birth: z.string().min(1),
});

export function PersonalInfoForm({
  setState,
  state,
  next,
}: StepProps<z.infer<typeof personalInfoSchema>>) {
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

const contactInfoSchema = z.object({
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

export function ContactInfoForm({
  next,
  prev,
  setState,
  state,
}: StepWithPrevProps<z.infer<typeof contactInfoSchema>>) {
  const form = useForm<z.infer<typeof contactInfoSchema>>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: state,
  });

  const onSubmit = (values: z.infer<typeof contactInfoSchema>) => {
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

const orgInfoSchema = z.object({
  company_fullname: z.string().trim().min(1, "Required"),
  company_address: z.string().trim().min(4),
  company_pincode: z.string().trim().min(6, "Invalid pincode"),
  company_city: z.string().trim().min(1, "Required"),
  company_state: z.string().trim().min(1, "Required"),
});

export function OrgInfoForm({
  next,
  prev,
  setState,
  state,
}: StepWithPrevProps<z.infer<typeof orgInfoSchema>>) {
  const form = useForm<z.infer<typeof orgInfoSchema>>({
    resolver: zodResolver(orgInfoSchema),
    defaultValues: state,
  });

  const onSubmit = (values: z.infer<typeof orgInfoSchema>) => {
    setState("company_address", values.company_address);
    setState("company_fullname", values.company_fullname);
    setState("company_pincode", values.company_pincode);
    setState("company_city", values.company_city);
    setState("company_state", values.company_state);
    next();
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Organization</CardTitle>
        <CardDescription>
          {"Proceed to fill all the information related your chit fund house."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="company_fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Lakshmi Chit Fund House" {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      as per the registration certificate
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Address</FormLabel>
                    <FormControl>
                      <Input placeholder="#123, 1st street ...." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company_pincode"
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
                name="company_city"
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
                name="company_state"
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

const bankInfoSchema = z.object({
  account_number: z
    .string()
    .trim()
    .min(10, "Phone number must be 10 digit")
    .max(10, "Phone number must be 10 digit"),
  confirm_account_number: z.string().trim().min(4),
  account_holder_name: z.string().trim().min(6, "Invalid pincode"),
  branch_name: z.string().trim().min(1, "Required"),
  ifsc_code: z.string().trim().min(1, "Required"),
  bank_address_pincode: z.string().trim().min(1, "Required"),
  bank_city: z.string().trim().min(1, "Required"),
  bank_state: z.string().trim().min(1, "Required"),
});

export function BankInfoForm({
  next,
  prev,
  setState,
  state,
}: StepWithPrevProps<z.infer<typeof bankInfoSchema>>) {
  const form = useForm<z.infer<typeof bankInfoSchema>>({
    resolver: zodResolver(bankInfoSchema),
    defaultValues: state,
  });

  const onSubmit = (values: z.infer<typeof bankInfoSchema>) => {
    setState("account_number", values.account_number);
    setState("confirm_account_number", values.confirm_account_number);
    setState("account_holder_name", values.account_holder_name);
    setState("branch_name", values.branch_name);
    setState("ifsc_code", values.ifsc_code);
    setState("bank_address_pincode", values.bank_address_pincode);
    setState("bank_city", values.bank_city);
    setState("bank_state", values.bank_state);

    next();
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Bank Account</CardTitle>
        <CardDescription>
          {
            "Should be proper valid information to avoid payment issues further for your subscribers. Anyway you can still update info later in profile section."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="account_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_account_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Account Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="account_holder_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Holder Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branch_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ifsc_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFSC Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bank_address_pincode"
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
                name="bank_city"
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
                name="bank_state"
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

const documentsSchema = z.object({
  registeration_certificate_url: z.string().trim().min(1, "Required"),
  aadhar_card_front_url: z.string().trim().min(1, "Required"),
  aadhar_card_back_url: z.string().trim().min(1, "Required"),
});

export function DocumentsForm({
  next,
  prev,
  setState,
  state,
}: StepWithPrevProps<z.infer<typeof documentsSchema>>) {
  const form = useForm<z.infer<typeof documentsSchema>>({
    resolver: zodResolver(documentsSchema),
    defaultValues: state,
  });

  const onSubmit = (values: z.infer<typeof documentsSchema>) => {
    setState("aadhar_card_back_url", values.registeration_certificate_url);
    setState("aadhar_card_front_url", values.aadhar_card_front_url);
    setState(
      "registeration_certificate_url",
      values.registeration_certificate_url
    );

    next();
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Bank Account</CardTitle>
        <CardDescription>
          {
            "Should be proper valid information to avoid payment issues further for your subscribers. Anyway you can still update info later in profile section."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="registeration_certificate_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Certificate</FormLabel>
                    <FormControl>
                      <div className="w-full h-52 rounded-md border border-dashed " />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 w-full">
                <FormField
                  control={form.control}
                  name="aadhar_card_front_url"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Confirm Account Number</FormLabel>
                      <FormControl>
                        <div className="w-full h-32 rounded-md border border-dashed " />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aadhar_card_back_url"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <div className="w-full h-32 rounded-md border border-dashed " />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button className="w-full">Complete</Button>
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
