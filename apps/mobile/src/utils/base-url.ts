import Constants from "expo-constants";

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production EXPO_PUBLIC_SERVER_URL.
 */
export const getBaseUrl = () => {
  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 8081 of expo server should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   *
   * **NOTE**: This is only for development. In production, you'll want to set the
   * baseUrl to your production EXPO_PUBLIC_SERVER_URL.
   */
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (!localhost) {
    return process.env.EXPO_PUBLIC_SERVER_URL;
  }

  return `https://chit-money-collector-console--preview.vercel.app`;
};
