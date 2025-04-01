import { createClerkClient } from "@clerk/backend";
import { jwtDecode } from "jwt-decode";

export const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const auth = async (req: Request) => {
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
