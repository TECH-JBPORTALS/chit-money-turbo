import { DocumentsForm } from "@/components/forms/profile-forms";
import { Separator } from "@cmt/ui/components/separator";

export default function Page() {
  return (
    <>
      <div>
        <div className="text-lg font-medium">Documents</div>
        <p className="text-sm text-muted-foreground">Update your documents.</p>
      </div>
      <Separator />
      <DocumentsForm
        state={{
          aadhar_card_back_url: "",
          aadhar_card_front_url: "",
          registeration_certificate_url: "",
        }}
      />
    </>
  );
}
