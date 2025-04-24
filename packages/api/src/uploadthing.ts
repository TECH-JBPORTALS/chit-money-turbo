import { auth, clerkClient } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await auth();
      if (!user?.userId) throw new UploadThingError("Unauthorized");
      return { userId: user.userId };
    })
    .onUploadComplete(({ file, metadata }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),
  documentsUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.enum([
        "registeration_certificate_url",
        "aadhar_card_front_url",
        "aadhar_card_back_url",
      ])
    )
    .middleware(async ({ input }) => {
      const { userId } = await auth();

      if (!userId) throw new UploadThingError("Unauthorized");

      return { userId, input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);
      try {
        const client = await clerkClient();
        const privateData = (await client.users.getUser(metadata.userId))
          .privateMetadata;
        await client.users.updateUserMetadata(metadata.userId, {
          privateMetadata: {
            ...privateData,
            documents: {
              ...(privateData.documents as any),
            },
          },
        });

        // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
        return { uploadedBy: metadata.userId };
      } catch (e) {
        console.log("syncing with clerk", e);
        throw new UploadThingError("Couldn't able to upload");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
