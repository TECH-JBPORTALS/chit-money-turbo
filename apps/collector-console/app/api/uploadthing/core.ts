import { updateUserPrivateMetadata } from "@/lib/actions";
import { DocumentKeysEnum, documentsSchema } from "@/lib/validators";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  documentsUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
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
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      const { userId } = await auth();

      // If you throw, the user will not be able to upload
      if (!userId) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId, input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
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
              ...privateData.documents,
              [metadata.input]: file.key, //update the url to respective selected document slot
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
