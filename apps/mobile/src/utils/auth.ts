import { clerk } from "@cmt/api";
import { jwtDecode } from "jwt-decode";

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
