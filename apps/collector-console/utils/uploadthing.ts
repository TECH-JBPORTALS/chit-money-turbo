import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@cmt/api/routers/uploadthing";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export const getUTFile = (UTFileKey: string) =>
  `https://qlqyyestnd.ufs.sh/f/${UTFileKey}`;
