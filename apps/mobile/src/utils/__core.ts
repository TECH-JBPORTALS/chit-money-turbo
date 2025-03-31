import { createUploadthing, UploadThingError } from "uploadthing/server";
import type { FileRouter } from "uploadthing/server";
import { createClerkClient } from "@clerk/backend";
import { jwtDecode } from "jwt-decode";

const f = createUploadthing();

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const auth = async (req: Request) => {
  // Get the session token from the request
  const sessionToken = req.headers.get("authorization")?.split(" ")[1];

  if (!sessionToken) {
    return null;
  }

  const decodedToken = jwtDecode<{ sid: string }>(sessionToken);

  // Verify the session and get the user ID
  const session = await clerk.sessions.getSession(decodedToken.sid);

  return session;
};

export const uploadRouter = {
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user?.userId) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId };
    })
    .onUploadComplete(({ file, metadata }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
