import { fakerEN_IN } from "@faker-js/faker";
import { createClerkClient } from "@clerk/backend";
import { db } from "./client";
import { reset } from "drizzle-seed";
import { publicSchema, collectorsSchema, subscribersSchema } from ".";
import { addMonths } from "date-fns";

async function main() {
  //Check for seed mode
  if (!process.env.SEED_MODE)
    throw new Error("SEED_MODE set to be true in the env");

  // Initialize the faker
  const f = fakerEN_IN;

  // Initialize the clerk
  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

  // Clear the existing users
  const users = await clerk.users.getUserList({ limit: 100 });

  console.log(`Deleting ${users.totalCount} users in clerk 🧹\n`);
  await Promise.all(users.data.map((u) => clerk.users.deleteUser(u.id)));

  // Trucate the Tabels
  console.log("Reset database 🔃\n");
  await reset(db, publicSchema);
  await reset(db, subscribersSchema);
  await reset(db, collectorsSchema);

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
        onboardingComplete: true,
      },
    });

    console.log(`Creating ${user.firstName}'s collector profile 👤...\n`);

    //collector
    await db.insert(collectorsSchema.users).values({
      id: user.id,
      orgName: `${user.firstName}'s Chit Fund House®`,
      orgCertificateKey: `ut_${f.string.ulid()}`,
      aadharBackFileKey: `ut_${f.string.ulid()}`,
      aadharFrontFileKey: `ut_${f.string.ulid()}`,
      dateOfBirth: f.date.past({ years: 18 }).toDateString(),
    });

    //address
    await db.insert(collectorsSchema.addresses).values({
      addressLine: f.location.streetAddress({ useFullAddress: true }),
      city: f.location.city(),
      pincode: f.location.zipCode("######"),
      state: f.location.state(),
      userId: user.id,
    });

    //contact
    await db.insert(collectorsSchema.contacts).values({
      primaryPhoneNumber: f.string.numeric({
        length: 10,
        exclude: ["2", "3"],
        allowLeadingZeros: false,
      }),
      secondaryPhoneNumber: f.string.numeric({
        length: 10,
        exclude: ["2", "3"],
        allowLeadingZeros: false,
      }),
      userId: user.id,
    });

    //bank account
    await db.insert(collectorsSchema.bankAccounts).values({
      accountHolderName: `${user.firstName?.toUpperCase()} ${user.lastName?.toUpperCase()}`,
      accountNumber: f.string.numeric(12),
      branchName: f.location.streetAddress(),
      ifscCode: `${f.helpers.arrayElement(["SBI", "CNR", "UTI", "PNB"])}${f.string.numeric(6)}`,
      upiId: `${f.string.numeric({
        length: 10,
        exclude: ["2", "3"],
        allowLeadingZeros: false,
      })}@${f.helpers.arrayElement(["ybl", "axs", "oicici", "samsung"])}`,
      accountType: f.helpers.arrayElement(["savings", "current"]),
      city: f.location.city(),
      pincode: f.location.zipCode("######"),
      state: f.location.state(),
      userId: user.id,
    });

    const startsOn = f.date.future({ years: 2 });
    const scheme = f.number.int({ min: 10, max: 20 }); // Number of months
    const endsOn = addMonths(startsOn, scheme);

    // Batches
    for (let index = 0; index < 5; index++) {
      await db.insert(publicSchema.batches).values({
        name: `${f.company.buzzNoun().toLocaleUpperCase()} ${f.date.between({ from: Date.now(), to: "2030-01-01" }).getFullYear()}`,
        defaultCommissionRate: f.number.float({ min: 2, max: 8 }).toString(),
        dueOn: f.helpers.arrayElement([10, 1, 5, 20]).toString(),
        startsOn: startsOn.toDateString(),
        endsOn: endsOn.toDateString(),
        scheme: scheme,
        fundAmount: f.helpers
          .arrayElement([
            100000, 200000, 500000, 600000, 100000, 1500000, 200000,
          ])
          .toString(),
        batchStatus: "active",
        batchType: "interest",
        collectorId: user.id,
      });
    }
  }

  console.log("Collectors all set ✅\n\n");

  //Create subscriber
  for (let index = 0; index < 10; index++) {
    const firstName = f.person.firstName();
    const lastName = f.person.firstName();
    const user = await clerk.users.createUser({
      emailAddress: [f.internet.email({ firstName, lastName })],
      firstName,
      lastName,
      password: "test1234.com",
      skipPasswordChecks: true,
      skipPasswordRequirement: true,
      publicMetadata: {
        role: "subscriber",
        onboardingComplete: true,
      },
    });

    console.log(`Creating ${user.firstName}'s subscriber profile 👤...\n`);

    //collector
    await db.insert(subscribersSchema.users).values({
      id: user.id,
      faceId: `SUB${f.string.numeric(6)}`,
      panCardNumber: `${f.helpers.fromRegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}")}`, //eg. ABCDE8930J
      aadharBackFileKey: `ut_${f.string.ulid()}`,
      aadharFrontFileKey: `ut_${f.string.ulid()}`,
      nomineeName: f.person.fullName(),
      nomineeRelationship: f.helpers.arrayElement([
        "Brother",
        "Mother",
        "Father",
        "Sister",
        "Daughter",
        "Son",
      ]),

      dateOfBirth: f.date.past({ years: 18 }).toDateString(),
    });

    //address
    await db.insert(subscribersSchema.addresses).values({
      addressLine: f.location.streetAddress({ useFullAddress: true }),
      city: f.location.city(),
      pincode: f.location.zipCode("######"),
      state: f.location.state(),
      userId: user.id,
    });

    //contact
    await db.insert(subscribersSchema.contacts).values({
      primaryPhoneNumber: f.string.numeric({
        length: 10,
        exclude: ["2", "3"],
        allowLeadingZeros: false,
      }),
      secondaryPhoneNumber: f.string.numeric({
        length: 10,
        exclude: ["2", "3"],
        allowLeadingZeros: false,
      }),
      userId: user.id,
    });

    //bank account
    await db.insert(subscribersSchema.bankAccounts).values({
      accountHolderName: `${user.firstName?.toUpperCase()} ${user.lastName?.toUpperCase()}`,
      accountNumber: f.string.numeric(12),
      branchName: f.location.streetAddress(),
      ifscCode: `${f.helpers.arrayElement(["SBI", "CNR", "UTI", "PNB"])}${f.string.numeric(6)}`,
      upiId: `${f.string.numeric({
        length: 10,
        exclude: ["2", "3"],
        allowLeadingZeros: false,
      })}@${f.helpers.arrayElement(["ybl", "axs", "oicici", "samsung"])}`,
      accountType: f.helpers.arrayElement(["savings", "current"]),
      city: f.location.city(),
      pincode: f.location.zipCode("######"),
      state: f.location.state(),
      userId: user.id,
    });
  }
}

main()
  .then(() => console.log("Seed completed successfully ✅"))
  .catch((e) => console.error(e))
  .finally(() =>
    console.log("\n\n...................NAMASTE 🙏.....................\n\n")
  );
