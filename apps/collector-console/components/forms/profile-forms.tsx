"use client";

import { Input } from "@cmt/ui/components/input";
import { Button } from "@cmt/ui/components/button";
import { useForm } from "react-hook-form";
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
  bankInfoSchema,
  contactInfoSchema,
  documentsSchema,
  orgInfoSchema,
  personalInfoSchema,
} from "@cmt/validators";
import Uploader from "../uploader";
import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Building2Icon } from "lucide-react";

export function PersonalInfoForm() {
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
  });

  const onSubmit = async (values: z.infer<typeof personalInfoSchema>) => {
    console.log(values);
  };

  return (
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
        <Button
          className="w-fit"
          disabled={!form.formState.isDirty}
          isLoading={form.formState.isSubmitting}
        >
          Update Details
        </Button>
      </form>
    </Form>
  );
}

export function ContactInfoForm() {
  const form = useForm<z.infer<typeof contactInfoSchema>>({
    resolver: zodResolver(contactInfoSchema),
  });

  const onSubmit = async (values: z.infer<typeof contactInfoSchema>) => {
    console.log(values);
  };

  return (
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
                  <Input placeholder="+91" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secondaryPhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="#123, 1st street ...." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
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
          /> */}
        </div>
        <Button
          className="w-fit"
          disabled={!form.formState.isDirty}
          isLoading={form.formState.isSubmitting}
        >
          Update Details
        </Button>
      </form>
    </Form>
  );
}

const orgInfoSchemaWithLogo = orgInfoSchema.merge(
  z.object({
    company_logo_url: z.string().optional(),
  })
);

export function OrgInfoForm() {
  const form = useForm<z.infer<typeof orgInfoSchemaWithLogo>>({
    resolver: zodResolver(orgInfoSchemaWithLogo),
  });

  const onSubmit = async (values: z.infer<typeof orgInfoSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="company_logo_url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex flex-row gap-2 items-center">
                    <Avatar className="size-12 border border-muted-foreground">
                      <AvatarImage src="https://github.com/shadcn" />
                      <AvatarFallback>
                        <Building2Icon
                          strokeWidth={1}
                          className="text-muted-foreground"
                        />
                      </AvatarFallback>
                    </Avatar>
                    <Button variant={"outline"}>Upload New Picture</Button>
                  </div>
                </FormControl>
                <FormMessage />
                <FormDescription>
                  This picture will be used as your organization logo or image.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orgName"
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
          {/* <FormField
            control={form.control}
            name=""
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
            name="st"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>
        <Button
          className="w-fit"
          disabled={!form.formState.isDirty}
          isLoading={form.formState.isSubmitting}
        >
          Update Details
        </Button>
      </form>
    </Form>
  );
}

export function BankInfoForm() {
  const form = useForm<z.infer<typeof bankInfoSchema>>({
    resolver: zodResolver(bankInfoSchema),
  });

  const onSubmit = async (values: z.infer<typeof bankInfoSchema>) => {
    console.log(values);
  };

  return (
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
                  <Input {...field} />
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
                  <Input {...field} />
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
            name="pincode"
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
        <Button
          className="w-fit"
          disabled={!form.formState.isDirty}
          isLoading={form.formState.isSubmitting}
        >
          Update Details
        </Button>
      </form>
    </Form>
  );
}

export function DocumentsForm() {
  const form = useForm<z.infer<typeof documentsSchema>>({
    resolver: zodResolver(documentsSchema),
  });

  const onSubmit = async (values: z.infer<typeof documentsSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="orgCertificateKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Certificate</FormLabel>
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
          </div>

          <div className="grid grid-cols-2 gap-6">
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
        </div>
        <Button
          className="w-fit"
          disabled={!form.formState.isDirty}
          isLoading={form.formState.isSubmitting}
        >
          Update Details
        </Button>
      </form>
    </Form>
  );
}
