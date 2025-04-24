"use client";
import { getUTFile, UploadButton, UploadDropzone } from "@/utils/uploadthing";
import { OurFileRouter } from "@cmt/api/uploadthing";
import { cn } from "@cmt/ui/lib/utils";
import { RotateCwIcon } from "lucide-react";
import Image from "next/image";
import { UploadthingComponentProps } from "@uploadthing/react";

export default function Uploader({
  fileKey,
  ...props
}: UploadthingComponentProps<OurFileRouter, "documentsUploader"> & {
  fileKey: string;
}) {
  if (fileKey)
    return (
      <div className="w-full group overflow-hidden rounded-md border bg-card object-contain relative h-60">
        <Image
          src={getUTFile(fileKey)}
          fill
          alt={fileKey}
          objectFit="contain"
        />
        <div
          data-slot="get"
          className={cn(
            "absolute h-full w-full flex items-center justify-center z-10 "
          )}
        >
          <UploadButton
            {...props}
            config={{ appendOnPaste: true, mode: "auto" }}
            className="ut-button:bg-accent bg-background/80 w-full h-full opacity-0 hover:opacity-100 duration-200 transition-all ut-uploading:opacity-100 ut-button:text-accent-foreground ut-button:ut-uploading:bg-primary/40 ut-button:ut-uploading:after:bg-primary ut-button:ring-primary ut-allowed-content:text-accent-foreground"
            content={{
              button: ({ ready, isUploading }) => {
                if (ready && isUploading)
                  return (
                    <div className="flex gap-2 text-sm z-40 items-center">
                      <RotateCwIcon className="size-4 animate-spin" />
                      Uploading...
                    </div>
                  );
                else if (ready)
                  return (
                    <div className="flex gap-2 text-sm items-center">
                      <RotateCwIcon className="size-4" />
                      Re-Upload
                    </div>
                  );

                return "Getting Ready...";
              },
              allowedContent({
                isUploading,
                ready,
                fileTypes,
                uploadProgress,
              }) {
                if (isUploading && ready)
                  return `Seems like your file is uploading... (${uploadProgress})%`;
                else if (ready) "Checking what you allow";
                return `You can upload an ${fileTypes.join(", ").toUpperCase()}`;
              },
            }}
          />
        </div>
      </div>
    );
  return (
    <UploadDropzone
      {...props}
      appearance={{
        button: {
          background: "var(--secondary)",
          color: "var(--secondary-foreground)",
        },
        container: {
          borderColor: "var(--border)",
        },
        allowedContent: {
          color: "var(--muted-foreground)",
        },
        label: {
          color: "var(--foreground)",
        },
      }}
      className="ut-button:bg-accent h-60 ut-button:text-accent-foreground ut-button:ut-uploading:bg-primary/40 ut-button:px-6 ut-button:ut-uploading:after:bg-primary ut-allowed-content:text-muted-foreground"
      config={{ appendOnPaste: true, mode: "auto" }}
    />
  );
}
