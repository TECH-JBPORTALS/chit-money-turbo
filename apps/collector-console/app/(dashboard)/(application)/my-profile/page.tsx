import {
  ContactInfoForm,
  PersonalInfoForm,
} from "@/components/forms/profile-forms";
import { Separator } from "@cmt/ui/components/separator";

export default function Page() {
  return (
    <>
      <div>
        <div className="text-lg font-medium">Account</div>
        <p className="text-sm text-muted-foreground">
          Update your account settings.
        </p>
      </div>
      <Separator />
      <PersonalInfoForm
        state={{
          date_of_birth: "",
          first_name: "",
          last_name: "",
        }}
      />
      <div>
        <div className="text-lg font-medium">Contact Information</div>
        <p className="text-sm text-muted-foreground">
          Update your contact details.
        </p>
      </div>
      <Separator />
      <ContactInfoForm
        state={{
          primary_phone_number: "",
          contact_address: "",
          contact_city: "",
          contact_pincode: "",
          contact_state: "",
        }}
      />
    </>
  );
}
