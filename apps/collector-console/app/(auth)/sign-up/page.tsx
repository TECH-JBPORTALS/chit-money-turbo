import { SignUpForm } from "@/components/forms/signup-form";
import { loadClerkSearchParams } from "@/lib/search-params";
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

async function getInvitaion(clerkTicket: string | null) {
  // 1. Check for clerk ticket
  if (!clerkTicket) return;

  // 2. Convert jwt ticket to get payload
  const payload = jwtDecode<ClerkTicketPayload>(clerkTicket);

  // 3. Get user pending invitaion associated with the token
  const cleint = await clerkClient();
  const { data } = await cleint.invitations.getInvitationList({
    query: payload.sid,
    status: "pending",
  });
  return data.at(0);
}

export default async function Page({ searchParams }: PageProps) {
  const { __clerk_ticket } = await loadClerkSearchParams(searchParams);

  const invitaion = await getInvitaion(__clerk_ticket);

  return (
    <SignUpForm
      emailAddress={invitaion?.emailAddress}
      clerkTicket={__clerk_ticket ?? undefined}
    />
  );
}
