import { SignOutButton, UserButton } from "@clerk/nextjs";
import { auth, clerkClient } from "@clerk/nextjs/server";
export default async function Page() {
  const { userId } = await auth();

  if (!userId) throw Error("No user");
  const { users } = await clerkClient();
  const { fullName, emailAddresses } = await users.getUser(userId);
  return (
    <div className="flex flex-col gap-8 items-center justify-center text-2xl h-svh">
      <UserButton />
      Welcome to Dashobard {fullName ?? emailAddresses.at(0)?.emailAddress}
    </div>
  );
}
