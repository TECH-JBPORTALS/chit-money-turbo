import { en_IN, Faker } from "@faker-js/faker";
import { createClerkClient } from "@clerk/backend";
import { db } from "./client";
import { seed, reset, getGeneratorsFunctions } from "drizzle-seed";
import { publicSchema, collectorsSchema, subscribersSchema } from ".";

const schema = { ...publicSchema, collectorsSchema, subscribersSchema };

async function main() {
  //Check for seed mode
  if (!process.env.SEED_MODE)
    throw new Error("SEED_MODE set to be true in the env");

  // Initialize the faker
  const f = new Faker({
    locale: [en_IN],
  });

  // Initialize the clerk
  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

  // Clear the existing users
  const users = await clerk.users.getUserList({ limit: 100 });

  console.log(`Deleting ${users.totalCount} users in clerk 🧹\n`);
  await Promise.all(users.data.map((u) => clerk.users.deleteUser(u.id)));

  // Trucate the Tabels
  console.log("Reset database 🔃\n");
  await reset(db, schema);

  //Create collectors
  for (let index = 0; index < 5; index++) {
    const firstName = f.person.firstName("male");
    const lastName = f.person.firstName("male");
    const user = await clerk.users.createUser({
      emailAddress: [f.internet.email({ firstName, lastName })],
      firstName,
      lastName,
      password: "test1234.com",
      skipPasswordChecks: true,
      skipPasswordRequirement: true,
      publicMetadata: {
        role: "collector",
      },
    });

    //address
    await seed(db, schema).refine((func) => ({}));
  }
}

main()
  .then(() => console.log("Seed completed successfully ✅"))
  .catch((e) => console.error(e))
  .finally(() =>
    console.log("\n\n...................NAMASTE 🙏.....................\n\n")
  );
