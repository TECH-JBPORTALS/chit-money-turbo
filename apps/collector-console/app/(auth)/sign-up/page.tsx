import { SignUpForm } from "@/components/signup-form";
import { loadSearchParams } from "@/lib/clerk-searchparams";
import { clerkClient } from "@clerk/nextjs/server";
import { jwtDecode } from "jwt-decode";
import { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

type ClerkTicketPayload = {
  eis: number;
  exp: number;
  iid: string;
  sid: string;
  st: string;
};

export default async function Page({ searchParams }: PageProps) {
  const { __clerk_status, __clerk_ticket } =
    await loadSearchParams(searchParams);

  // 1.Check valid config
  if (!__clerk_status || !__clerk_ticket) throw Error("Not valid config path");

  // 2. Convert jwt ticket to get payload
  const payload = jwtDecode<ClerkTicketPayload>(__clerk_ticket);

  // 3. Get user pending invitaion associated with the token
  const cleint = await clerkClient();
  const { data } = await cleint.invitations.getInvitationList({
    query: payload.sid,
    status: "pending",
  });
  const inviation = data.at(0);

  if (!inviation) throw Error("No invitation found");

  return (
    <SignUpForm email={inviation.emailAddress} clerkTicket={__clerk_ticket} />
  );
}
