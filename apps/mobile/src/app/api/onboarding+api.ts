import { auth, clerk } from "~/utils/__auth";

export async function POST(req: Request) {
  const session = await auth(req);

  const { onboardingComplete } = (await req.json()) as {
    onboardingComplete: boolean;
  };

  if (!session?.userId)
    return Response.json("Unauthorized to access", { status: 401 });

  try {
    await clerk.users.updateUser(session.userId, {
      publicMetadata: {
        onboardingComplete,
      },
    });

    return Response.json({ message: "Ok, Successful" }, { status: 200 });
  } catch (error: any) {
    return Response.json(
      {
        message: "Can't update the user meta data",
        description: error,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return Response.json("Hello World");
}
