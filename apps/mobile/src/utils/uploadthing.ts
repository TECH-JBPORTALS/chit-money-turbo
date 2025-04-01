import { useAuth } from "@clerk/clerk-expo";
import { generateReactNativeHelpers } from "@uploadthing/expo";
import React, { useState } from "react";
import { UploadRouter } from "~/app/api/uploadthing+api";

export const createUploadHelpers = (token: string | null) => {
  return generateReactNativeHelpers<UploadRouter>({
    /**
     * Your server url.
     * @default process.env.EXPO_PUBLIC_SERVER_URL
     * @remarks In dev we will also try to use Expo.debuggerHost
     */
    url: "/api/uploadthing",
    fetch: (input, init) => {
      return fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${token}`,
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
