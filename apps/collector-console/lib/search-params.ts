import { createLoader, parseAsString, SearchParams } from "nuqs/server";

//NUQS Search params definitaion
export const clerkSearchParams = {
  __clerk_status: parseAsString,
  __clerk_ticket: parseAsString,
};

export const loadClerkSearchParams = createLoader(clerkSearchParams);
