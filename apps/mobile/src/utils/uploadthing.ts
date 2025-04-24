import { useAuth } from "@clerk/clerk-expo";
import { generateReactNativeHelpers } from "@uploadthing/expo";
import React, { useState } from "react";
import { OurFileRouter } from "@cmt/api/uploadthing";
import { getBaseUrl } from "./base-url";

export const createUploadHelpers = (token: string | null) => {
  return generateReactNativeHelpers<OurFileRouter>({
    /**
     * Your server url.
     * @default process.env.EXPO_PUBLIC_SERVER_URL
     * @remarks In dev we will also try to use Expo.debuggerHost
     */
    url: `${getBaseUrl()}/api/uploadthing`,
    fetch: (input, init) => {
      return fetch(input, {
        ...init,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
    },
  });
};

export const useUploadHelpers = () => {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  React.useEffect(() => {
    const initializeHelpers = async () => {
      const token = await getToken();
      setToken(token);
    };

    initializeHelpers();
  }, [getToken]);

  return createUploadHelpers(token);
};

export const getUTPublicUrl = (fileKey: string) =>
  `https://qlqyyestnd.ufs.sh/f/${fileKey}`;
