import { clerk } from "../trpc";

export async function getQueryUserIds(query?: string) {
  if (!query) return;

  const { data: users } = await clerk.users.getUserList({
    query,
  });

  const userIds = users.map((user) => user.id);

  return userIds;
}

export async function getClerkUser(userId: string) {
  const { primaryEmailAddress, id, imageUrl, firstName, lastName } =
    await clerk.users.getUser(userId);

  return {
    id,
    firstName,
    lastName,
    imageUrl,
    primaryEmailAddress,
  };
}
