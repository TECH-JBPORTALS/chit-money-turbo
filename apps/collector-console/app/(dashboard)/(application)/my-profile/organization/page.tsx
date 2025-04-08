import { Separator } from "@cmt/ui/components/separator";
import { OrgInfoForm } from "@/components/forms/profile-forms";

export default function Page() {
  return (
    <>
      <div>
        <div className="text-lg font-medium">Organization</div>
        <p className="text-sm text-muted-foreground">
          Update your organization details.
        </p>
      </div>
      <Separator />
      <OrgInfoForm
        state={{
          company_fullname: "",
          company_address: "",
          company_pincode: "",
          company_city: "",
          company_state: "",
          company_logo_url: "",
        }}
      />
    </>
  );
}
