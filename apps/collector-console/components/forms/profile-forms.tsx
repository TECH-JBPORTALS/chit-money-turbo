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
} from "@cmt/validator";
import Uploader from "../uploader";
import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Building2Icon } from "lucide-react";

export function PersonalInfoForm({
  state,
}: {
  state: z.infer<typeof personalInfoSchema>;
}) {
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      date_of_birth: state?.date_of_birth ?? "",
      first_name: state?.first_name ?? "",
      last_name: state?.last_name ?? "",
    },
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

export function ContactInfoForm({
  state,
}: {
  state: z.infer<typeof contactInfoSchema>;
}) {
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

  const onSubmit = async (values: z.infer<typeof contactInfoSchema>) => {
    console.log(values);
  };

  return (
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

export function OrgInfoForm({
  state,
}: {
  state: z.infer<typeof orgInfoSchemaWithLogo>;
}) {
  const form = useForm<z.infer<typeof orgInfoSchemaWithLogo>>({
    resolver: zodResolver(orgInfoSchemaWithLogo),
    defaultValues: {
      company_address: state?.company_address ?? "",
      company_city: state?.company_city ?? "",
      company_fullname: state?.company_fullname ?? "",
      company_pincode: state?.company_pincode ?? "",
      company_state: state?.company_state ?? "",
    },
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

export function BankInfoForm({
  state,
}: {
  state: z.infer<typeof bankInfoSchema>;
}) {
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

  const onSubmit = async (values: z.infer<typeof bankInfoSchema>) => {
    console.log(values);
  };

  return (
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

export function DocumentsForm({
  state,
}: {
  state: z.infer<typeof documentsSchema>;
}) {
  const form = useForm<z.infer<typeof documentsSchema>>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      aadhar_card_back_url: state?.aadhar_card_back_url ?? "",
      aadhar_card_front_url: state?.aadhar_card_front_url ?? "",
      registeration_certificate_url: state?.registeration_certificate_url ?? "",
    },
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
              name="registeration_certificate_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Certificate</FormLabel>
                  <FormControl>
                    <Uploader
                      fileKey={field.value}
                      endpoint={"documentsUploader"}
                      input="registeration_certificate_url"
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
          </div>

          <div className="grid grid-cols-2 gap-6">
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
