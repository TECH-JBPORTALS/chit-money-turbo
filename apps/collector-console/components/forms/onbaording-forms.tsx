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
import { StepProps } from "@/types/step-form";
import {
  bankInfoSchema,
  contactInfoSchema,
  documentsSchema,
  orgInfoSchema,
  personalInfoSchema,
} from "@/lib/validators";
import Uploader from "../uploader";
import { useSteps } from "react-step-builder";

export function PersonalInfoForm({
  setState,
  state,
}: StepProps<z.infer<typeof personalInfoSchema>>) {
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      date_of_birth: state?.date_of_birth ?? "",
      first_name: state?.first_name ?? "",
      last_name: state?.last_name ?? "",
    },
  });
  const { next } = useSteps();

  const onSubmit = async (values: z.infer<typeof personalInfoSchema>) => {
    await setState(values);
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
            <Button className="w-full" isLoading={form.formState.isSubmitting}>
              Next <ArrowRightIcon />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export function ContactInfoForm({
  setState,
  state,
}: StepProps<z.infer<typeof contactInfoSchema>>) {
  const form = useForm<z.infer<typeof contactInfoSchema>>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      primary_phone_number: state?.primary_phone_number ?? "",
      contact_address: state?.contact_address ?? "",
      contact_city: state?.contact_city ?? "",
      contact_pincode: state?.contact_pincode ?? "",
      contact_state: state?.contact_state ?? "",
    },
  });
  const { next, prev } = useSteps();

  const onSubmit = async (values: z.infer<typeof contactInfoSchema>) => {
    await setState(values);
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
            <Button className="w-full" isLoading={form.formState.isSubmitting}>
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

export function OrgInfoForm({
  setState,
  state,
}: StepProps<z.infer<typeof orgInfoSchema>>) {
  const form = useForm<z.infer<typeof orgInfoSchema>>({
    resolver: zodResolver(orgInfoSchema),
    defaultValues: {
      company_address: state?.company_address ?? "",
      company_city: state?.company_city ?? "",
      company_fullname: state?.company_fullname ?? "",
      company_pincode: state?.company_pincode ?? "",
      company_state: state?.company_state ?? "",
    },
  });
  const { next, prev } = useSteps();

  const onSubmit = async (values: z.infer<typeof orgInfoSchema>) => {
    await setState(values);
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
            <Button className="w-full" isLoading={form.formState.isSubmitting}>
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

export function BankInfoForm({
  setState,
  state,
}: StepProps<z.infer<typeof bankInfoSchema>>) {
  const form = useForm<z.infer<typeof bankInfoSchema>>({
    resolver: zodResolver(bankInfoSchema),
    defaultValues: {
      account_holder_name: state?.account_holder_name ?? "",
      account_number: state?.account_number ?? "",
      bank_address_pincode: state?.bank_address_pincode ?? "",
      bank_city: state?.bank_city ?? "",
      bank_state: state?.bank_state ?? "",
      branch_name: state?.branch_name ?? "",
      confirm_account_number: state?.confirm_account_number ?? "",
      ifsc_code: state?.ifsc_code ?? "",
    },
  });
  const { next, prev } = useSteps();

  const onSubmit = async (values: z.infer<typeof bankInfoSchema>) => {
    await setState(values);

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
            <Button className="w-full" isLoading={form.formState.isSubmitting}>
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

export function DocumentsForm({
  setState,
  state,
}: StepProps<z.infer<typeof documentsSchema>>) {
  const form = useForm<z.infer<typeof documentsSchema>>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      aadhar_card_back_url: state?.aadhar_card_back_url ?? "",
      aadhar_card_front_url: state?.aadhar_card_front_url ?? "",
      registeration_certificate_url: state?.registeration_certificate_url ?? "",
    },
  });
  const { next, prev } = useSteps();

  const onSubmit = async (values: z.infer<typeof documentsSchema>) => {
    await setState(values);

    next();
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Documents</CardTitle>
        <CardDescription>
          {"Upload clear pictures to avoid further confusions."}
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
                      <Uploader
                        fileKey={field.value}
                        input="registeration_certificate_url"
                        endpoint={"documentsUploader"}
                        onUploadError={(e) => {
                          form.setError("registeration_certificate_url", {
                            message: e.message,
                          });
                        }}
                        onClientUploadComplete={(res) => {
                          field.onChange(res.at(0)?.key);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aadhar_card_front_url"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Adhar Card Front</FormLabel>
                    <FormControl>
                      <Uploader
                        fileKey={field.value}
                        input="aadhar_card_front_url"
                        endpoint={"documentsUploader"}
                        onUploadError={(e) => {
                          form.setError("aadhar_card_front_url", {
                            message: e.message,
                          });
                        }}
                        onClientUploadComplete={(res) => {
                          field.onChange(res.at(0)?.key);
                        }}
                      />
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
                    <FormLabel>Aadhar Card Back</FormLabel>
                    <FormControl>
                      <Uploader
                        fileKey={field.value}
                        input="aadhar_card_back_url"
                        endpoint={"documentsUploader"}
                        onUploadError={(e) => {
                          form.setError("aadhar_card_back_url", {
                            message: e.message,
                          });
                        }}
                        onClientUploadComplete={(res) => {
                          field.onChange(res.at(0)?.key);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-full" isLoading={form.formState.isSubmitting}>
              Complete
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
