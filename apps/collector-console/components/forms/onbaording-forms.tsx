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
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@cmt/ui/components/select";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { StepProps } from "@/types/step-form";
import {
  addressInfoSchema,
  bankInfoSchema,
  contactInfoSchema,
  documentsSchema,
  orgInfoSchema,
  personalInfoSchema,
} from "@cmt/validators";
import Uploader from "../uploader";
import { useSteps } from "react-step-builder";

export function PersonalInfoForm({
  setState,
  state,
}: StepProps<z.infer<typeof personalInfoSchema>>) {
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      dateOfBirth: state?.dateOfBirth ?? undefined,
      firstName: state?.firstName ?? "",
      lastName: state?.lastName ?? "",
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
                name="firstName"
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
                name="lastName"
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
                name="dateOfBirth"
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

export function OrgInfoForm({
  setState,
  state,
}: StepProps<z.infer<typeof orgInfoSchema>>) {
  const form = useForm<z.infer<typeof orgInfoSchema>>({
    resolver: zodResolver(orgInfoSchema),
    defaultValues: {
      orgName: state?.orgName ?? "",
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
                name="orgName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chit Fund House Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg. Lakshmi Chit Fund House"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      as per the registration certificate
                    </FormDescription>
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

export function ContactInfoForm({
  setState,
  state,
}: StepProps<z.infer<typeof contactInfoSchema>>) {
  const form = useForm<z.infer<typeof contactInfoSchema>>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      primaryPhoneNumber: state?.primaryPhoneNumber ?? "",
      secondaryPhoneNumber: state?.secondaryPhoneNumber ?? undefined,
    },
  });
  const { next, prev } = useSteps();

  const onSubmit = async (values: z.infer<typeof contactInfoSchema>) => {
    await setState({
      ...values,
      secondaryPhoneNumber: values.secondaryPhoneNumber ?? undefined,
    });
    next();
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Company Contact Information</CardTitle>
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
                name="primaryPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="eg. 9930390403"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Chit fund house contact number
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secondaryPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Secondary Phone Number (optional)"}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="eg. 9930390403"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Chit fund house secondary contact number, although it's
                      optional but it's recommended
                    </FormDescription>
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

export function AddressInfoForm({
  setState,
  state,
}: StepProps<z.infer<typeof addressInfoSchema>>) {
  const form = useForm<z.infer<typeof addressInfoSchema>>({
    resolver: zodResolver(addressInfoSchema),
    defaultValues: {
      addressLine: state?.addressLine ?? "",
      city: state?.city ?? "",
      pincode: state?.pincode ?? "",
      state: state?.state ?? "",
    },
  });
  const { next, prev } = useSteps();

  const onSubmit = async (values: z.infer<typeof addressInfoSchema>) => {
    await setState(values);
    next();
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Company Address Info</CardTitle>
        <CardDescription>
          {
            "Give a proper valid information so there will be no problem to reach out your chit fund house indeed"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="addressLine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="#123, 1st street ...." {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Your chit fund house address
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
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
                name="state"
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
      accountHolderName: state?.accountHolderName ?? "",
      accountNumber: state?.accountNumber ?? "",
      pincode: state?.pincode ?? "",
      city: state?.city ?? "",
      state: state?.state ?? "",
      branchName: state?.branchName ?? "",
      confirmAccountNumber: state?.confirmAccountNumber ?? "",
      ifscCode: state?.ifscCode ?? "",
      upiId: state?.upiId ?? "",
      accountType: state?.accountType ?? "savings",
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
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmAccountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Account Number</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountHolderName"
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
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={"Select..."} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="savings">Savings</SelectItem>
                          <SelectItem value="current">Current</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branchName"
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
                name="ifscCode"
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
                name="upiId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UPI Id</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>To accept online payment</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
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
                name="state"
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
      aadharBackFileKey: state?.aadharBackFileKey ?? "",
      aadharFrontFileKey: state?.aadharFrontFileKey ?? "",
      orgCertificateKey: state?.orgCertificateKey ?? "",
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
                name="orgCertificateKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Chit Fund House Registration Certificate
                    </FormLabel>
                    <FormControl>
                      <Uploader
                        fileKey={field.value}
                        endpoint={"documentsUploader"}
                        input="registeration_certificate_url"
                        onUploadError={(e) => {
                          form.setError("orgCertificateKey", {
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
                name="aadharFrontFileKey"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Adhar Card Front</FormLabel>
                    <FormControl>
                      <Uploader
                        fileKey={field.value}
                        input="aadhar_card_front_url"
                        endpoint={"documentsUploader"}
                        onUploadError={(e) => {
                          form.setError("aadharFrontFileKey", {
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
                name="aadharBackFileKey"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Aadhar Card Back</FormLabel>
                    <FormControl>
                      <Uploader
                        fileKey={field.value}
                        input="aadhar_card_back_url"
                        endpoint={"documentsUploader"}
                        onUploadError={(e) => {
                          form.setError("aadharBackFileKey", {
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
