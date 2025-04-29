import type { clerkClient } from "@clerk/nextjs/server";

export async function getQueryUserIds(
  clerk: Awaited<ReturnType<typeof clerkClient>>,
  query?: string
) {
  if (!query) return;

  const { data: users } = await clerk.users.getUserList({
    query,
  });

  const userIds = users.map((user) => user.id);

  return userIds;
}
