import { useAuth } from "@clerk/clerk-expo";
import { generateReactNativeHelpers } from "@uploadthing/expo";
import React, { useState } from "react";

import type { UploadRouter } from "~/utils/__core";

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
