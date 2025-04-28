import { DocumentsForm } from "@/components/forms/profile-forms";
import { Separator } from "@cmt/ui/components/separator";

export default function Page() {
  return (
    <>
      <div>
        <div className="text-lg font-medium">Documents</div>
        <p className="text-sm text-muted-foreground">
          Upload your documents & click on update details to save the details.
        </p>
      </div>
      <Separator />
      <DocumentsForm />
    </>
  );
}
