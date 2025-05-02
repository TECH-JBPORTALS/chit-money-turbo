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
  addressInfoSchema,
  bankInfoSchema,
  contactInfoSchema,
  documentsSchema,
  orgInfoSchema,
  personalInfoSchema,
} from "@cmt/validators";
import Uploader from "../uploader";
import { Avatar, AvatarFallback, AvatarImage } from "@cmt/ui/components/avatar";
import { Building2Icon, Loader2Icon } from "lucide-react";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@cmt/ui/components/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SpinnerPage } from "../spinner-page";

export function PersonalInfoForm() {
  const client = useQueryClient();
  const trpc = useTRPC();
  const router = useRouter();

  const { mutateAsync: updatePersonalDetails } = useMutation(
    trpc.collectors.updatePersonalDetails.mutationOptions({
      async onSuccess(data) {
        toast.success("Updated sucessfully");
        router.refresh();
        await client.invalidateQueries(
          trpc.collectors.getPersonalInfo.queryOptions()
        );
      },
    })
  );

  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: async () => {
      const data = await client.fetchQuery(
        trpc.collectors.getPersonalInfo.queryOptions()
      );
      return {
        dateOfBirth: data.dateOfBirth ?? "",
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
      };
    },
  });

  const onSubmit = async (values: z.infer<typeof personalInfoSchema>) => {
    await updatePersonalDetails(values);
  };

  if (form.formState.isLoading) return <SpinnerPage />;

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

const contactAddressSchema = contactInfoSchema.and(addressInfoSchema);

export function ContactInfoForm() {
  const client = useQueryClient();
  const trpc = useTRPC();
  const router = useRouter();

  const { mutateAsync: updateContactAddress } = useMutation(
    trpc.collectors.updateContactAddress.mutationOptions({
      async onSuccess(data) {
        toast.success("Updated sucessfully");
        router.refresh();
        await client.invalidateQueries(
          trpc.collectors.getContactAddress.queryOptions()
        );
      },
    })
  );

  const form = useForm<z.infer<typeof contactAddressSchema>>({
    resolver: zodResolver(contactAddressSchema),
    defaultValues: async () => {
      const data = await client.fetchQuery(
        trpc.collectors.getContactAddress.queryOptions()
      );
      return {
        primaryPhoneNumber: data?.primaryPhoneNumber ?? "",
        secondaryPhoneNumber: data?.secondaryPhoneNumber ?? "",
        addressLine: data.addressLine ?? "",
        city: data.city ?? "",
        pincode: data.pincode ?? "",
        state: data.state ?? "",
      };
    },
  });

  const onSubmit = async (values: z.infer<typeof contactAddressSchema>) => {
    await updateContactAddress(values);
  };

  if (form.formState.isLoading) return <SpinnerPage />;

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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addressLine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line</FormLabel>
                <FormControl>
                  <Textarea {...field} />
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

const orgInfoSchemaWithLogo = orgInfoSchema.merge(
  z.object({
    company_logo_url: z.string().optional(),
  })
);

export function OrgInfoForm() {
  const client = useQueryClient();
  const trpc = useTRPC();
  const router = useRouter();

  const { mutateAsync: updateOrg } = useMutation(
    trpc.collectors.updateOrg.mutationOptions({
      async onSuccess(data) {
        toast.success("Updated sucessfully");
        router.refresh();
        await client.invalidateQueries(
          trpc.collectors.getOrgInfo.queryOptions()
        );
      },
    })
  );

  const form = useForm<z.infer<typeof orgInfoSchema>>({
    resolver: zodResolver(orgInfoSchema),
    defaultValues: async () => {
      const data = await client.fetchQuery(
        trpc.collectors.getOrgInfo.queryOptions()
      );
      return {
        orgName: data?.orgName ?? "",
      };
    },
  });

  const onSubmit = async (values: z.infer<typeof orgInfoSchema>) => {
    await updateOrg(values);
  };

  if (form.formState.isLoading) return <SpinnerPage />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col gap-6">
          {/* <FormField
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
          /> */}

          <FormField
            control={form.control}
            name="orgName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  as per the registration certificate
                </FormDescription>
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

export function BankInfoForm() {
  const client = useQueryClient();
  const trpc = useTRPC();
  const router = useRouter();

  const { mutateAsync: updateBankAccount } = useMutation(
    trpc.collectors.updateBankAccount.mutationOptions({
      async onSuccess(data) {
        toast.success("Updated sucessfully");
        router.refresh();
        await client.invalidateQueries(
          trpc.collectors.getBankAccount.queryOptions()
        );
      },
    })
  );

  const form = useForm<z.infer<typeof bankInfoSchema>>({
    resolver: zodResolver(bankInfoSchema),
    defaultValues: async () => {
      const data = await client.fetchQuery(
        trpc.collectors.getBankAccount.queryOptions()
      );
      return {
        accountHolderName: data?.accountHolderName ?? "",
        accountNumber: data?.accountNumber ?? "",
        accountType: data?.accountType ?? "savings",
        branchName: data?.branchName ?? "",
        city: data?.city ?? "",
        ifscCode: data?.ifscCode ?? "",
        pincode: data?.pincode ?? "",
        state: data?.state ?? "",
        upiId: data?.upiId ?? "",
        confirmAccountNumber: data?.accountNumber ?? "",
      };
    },
  });

  const onSubmit = async (values: z.infer<typeof bankInfoSchema>) => {
    await updateBankAccount(values);
  };

  if (form.formState.isLoading) return <SpinnerPage />;

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
                  <Input type="password" {...field} />
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
  const client = useQueryClient();
  const trpc = useTRPC();
  const router = useRouter();

  const { mutateAsync: updateDocuments } = useMutation(
    trpc.collectors.updateDocuments.mutationOptions({
      async onSuccess(data) {
        toast.success("Updated sucessfully");
        router.refresh();
        await client.invalidateQueries(
          trpc.collectors.getDocuments.queryOptions()
        );
      },
    })
  );

  const form = useForm<z.infer<typeof documentsSchema>>({
    resolver: zodResolver(documentsSchema),
    defaultValues: async () => {
      const data = await client.fetchQuery(
        trpc.collectors.getDocuments.queryOptions()
      );
      return {
        aadharBackFileKey: data?.aadharBackFileKey ?? "",
        aadharFrontFileKey: data?.aadharFrontFileKey ?? "",
        orgCertificateKey: data?.orgCertificateKey ?? "",
      };
    },
  });

  const onSubmit = async (values: z.infer<typeof documentsSchema>) => {
    await updateDocuments(values);
  };

  if (form.formState.isLoading) return <SpinnerPage />;

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
