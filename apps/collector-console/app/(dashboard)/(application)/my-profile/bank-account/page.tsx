import { Separator } from "@cmt/ui/components/separator";
import { BankInfoForm } from "@/components/forms/profile-forms";

export default function Page() {
  return (
    <>
      <div>
        <div className="text-lg font-medium">Bank Account</div>
        <p className="text-sm text-muted-foreground">
          Update your bank account details.
        </p>
      </div>
      <Separator />
      <BankInfoForm
        state={{
          account_holder_name: "",
          account_number: "",
          bank_address_pincode: "",
          bank_city: "",
          bank_state: "",
          branch_name: "",
          confirm_account_number: "",
          ifsc_code: "",
        }}
      />
    </>
  );
}
