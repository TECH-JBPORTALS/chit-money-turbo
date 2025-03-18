import { SignOutButton, UserButton } from "@clerk/nextjs";
import { auth, clerkClient } from "@clerk/nextjs/server";
export default async function Page() {
  const { userId } = await auth();

  if (!userId) throw Error("No user");
  const { users } = await clerkClient();
  const data = await users.getUser(userId);
  return (
    <div className="flex flex-col gap-8 text-2xl h-svh">
      {/* Chit Fund Title */}
      <div>
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {data.privateMetadata.orgInfo.company_fullname}
        </h2>
        <p className="text-sm text-muted-foreground">
          All over details in this chit fund{" "}
        </p>
      </div>
      {/* Overview stat cards  grid*/}
      <div className="text-sm text-muted-foreground">
        Overview stat cards grid
      </div>
      {/* This month details sub-title */}
      <div className="text-sm text-muted-foreground">
        This month details sub-title
      </div>
      {/* This month stat cards grid */}
      <div className="text-sm text-muted-foreground">
        This month stat cards grid
      </div>
    </div>
  );
}
