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

const OrgInfoSchema = z.object({
  company_fullname: z.string().trim().min(1, "Required"),
  company_address: z.string().trim().min(4),
  company_pincode: z.string().trim().min(6, "Invalid pincode"),
  company_city: z.string().trim().min(1, "Required"),
  company_state: z.string().trim().min(1, "Required"),
});

interface OrgInfoFormProps {
  next: () => void;
  prev: () => void;
  state: z.infer<typeof OrgInfoSchema>;
  setState: (key: keyof z.infer<typeof OrgInfoSchema>, value: any) => void;
}

export function OrgInfoForm({ next, prev, setState, state }: OrgInfoFormProps) {
  const form = useForm<z.infer<typeof OrgInfoSchema>>({
    resolver: zodResolver(OrgInfoSchema),
    defaultValues: state,
  });

  const onSubmit = (values: z.infer<typeof OrgInfoSchema>) => {
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
