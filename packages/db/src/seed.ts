import { fakerEN_IN } from "@faker-js/faker";
import { createClerkClient } from "@clerk/backend";
import { db } from "./client";
import { reset } from "drizzle-seed";
import { schema } from "@/client";
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
  // await Promise.all(users.data.map((u) => clerk.users.deleteUser(u.id)));

  // // Trucate the Tabels
  console.log("Reset database 🔃\n");
  await reset(db, [schema.subscribersToBatches, schema.payouts]);

  //Create collectors
  // for (let index = 0; index < 5; index++) {
  //   const firstName = f.person.firstName("male");
  //   const lastName = f.person.firstName("male");
  //   const user = await clerk.users.createUser({
  //     emailAddress: [f.internet.email({ firstName, lastName })],
  //     firstName,
  //     lastName,
  //     password: "test1234.com",
  //     skipPasswordChecks: true,
  //     skipPasswordRequirement: true,
  //     publicMetadata: {
  //       role: "collector",
  //       onboardingComplete: true,
  //     },
  //   });

  //   console.log(`Creating ${user.firstName}'s collector profile 👤...\n`);

  //   //collector
  //   await db.insert(schema.collectors).values({
  //     id: user.id,
  //     orgName: `${user.firstName}'s Chit Fund House®`,
  //     orgCertificateKey: `ut_${f.string.ulid()}`,
  //     aadharBackFileKey: `ut_${f.string.ulid()}`,
  //     aadharFrontFileKey: `ut_${f.string.ulid()}`,
  //     dateOfBirth: f.date.past({ years: 18 }).toDateString(),
  //   });

  //   //address
  //   await db.insert(schema.collectorsAddresses).values({
  //     addressLine: f.location.streetAddress({ useFullAddress: true }),
  //     city: f.location.city(),
  //     pincode: f.location.zipCode("######"),
  //     state: f.location.state(),
  //     userId: user.id,
  //   });

  //   //contact
  //   await db.insert(schema.collectorsContacts).values({
  //     primaryPhoneNumber: f.string.numeric({
  //       length: 10,
  //       exclude: ["2", "3"],
  //       allowLeadingZeros: false,
  //     }),
  //     secondaryPhoneNumber: f.string.numeric({
  //       length: 10,
  //       exclude: ["2", "3"],
  //       allowLeadingZeros: false,
  //     }),
  //     userId: user.id,
  //   });

  //   //bank account
  //   await db.insert(schema.collectorsBankAccounts).values({
  //     accountHolderName: `${user.firstName?.toUpperCase()} ${user.lastName?.toUpperCase()}`,
  //     accountNumber: f.string.numeric(12),
  //     branchName: f.location.streetAddress(),
  //     ifscCode: `${f.helpers.arrayElement(["SBI", "CNR", "UTI", "PNB"])}${f.string.numeric(6)}`,
  //     upiId: `${f.string.numeric({
  //       length: 10,
  //       exclude: ["2", "3"],
  //       allowLeadingZeros: false,
  //     })}@${f.helpers.arrayElement(["ybl", "axs", "oicici", "samsung"])}`,
  //     accountType: f.helpers.arrayElement(["savings", "current"]),
  //     city: f.location.city(),
  //     pincode: f.location.zipCode("######"),
  //     state: f.location.state(),
  //     userId: user.id,
  //   });

  //   const startsOn = f.date.future({ years: 2 });
  //   const scheme = f.number.int({ min: 20, max: 30 }); // Number of months
  //   const endsOn = addMonths(startsOn, scheme);

  //   // Batches
  //   for (let index = 0; index < 5; index++) {
  //     await db.insert(schema.batches).values({
  //       name: `${f.company.buzzNoun()} ${f.date.between({ from: Date.now(), to: "2030-01-01" }).getFullYear()}`,
  //       defaultCommissionRate: f.number.float({ min: 2, max: 8 }),
  //       dueOn: f.helpers.arrayElement([10, 1, 5, 20]).toString(),
  //       startsOn: startsOn.toDateString(),
  //       endsOn: endsOn.toDateString(),
  //       scheme: scheme,
  //       fundAmount: f.helpers
  //         .arrayElement([
  //           100000, 200000, 500000, 600000, 100000, 1500000, 200000,
  //         ])
  //         .toString(),
  //       batchStatus: "active",
  //       batchType: "interest",
  //       collectorId: user.id,
  //     });
  //   }
  // }

  // console.log("Collectors all set ✅\n\n");

  // //Create subscriber
  // for (let index = 0; index < 30; index++) {
  //   const firstName = f.person.firstName();
  //   const lastName = f.person.firstName();
  //   const user = await clerk.users.createUser({
  //     emailAddress: [f.internet.email({ firstName, lastName })],
  //     firstName,
  //     lastName,
  //     password: "test1234.com",
  //     skipPasswordChecks: true,
  //     skipPasswordRequirement: true,
  //     publicMetadata: {
  //       role: "subscriber",
  //       onboardingComplete: true,
  //     },
  //   });

  //   console.log(`Creating ${user.firstName}'s subscriber profile 👤...\n`);

  //   //collector
  //   await db.insert(schema.subscribers).values({
  //     id: user.id,
  //     faceId: `SUB${f.string.numeric(6)}`,
  //     panCardNumber: `${f.helpers.fromRegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}")}`, //eg. ABCDE8930J
  //     aadharBackFileKey: `ut_${f.string.ulid()}`,
  //     aadharFrontFileKey: `ut_${f.string.ulid()}`,
  //     nomineeName: f.person.fullName(),
  //     nomineeRelationship: f.helpers.arrayElement([
  //       "Brother",
  //       "Mother",
  //       "Father",
  //       "Sister",
  //       "Daughter",
  //       "Son",
  //     ]),

  //     dateOfBirth: f.date.past({ years: 18 }).toDateString(),
  //   });

  //   //address
  //   await db.insert(schema.subscribersAddresses).values({
  //     addressLine: f.location.streetAddress({ useFullAddress: true }),
  //     city: f.location.city(),
  //     pincode: f.location.zipCode("######"),
  //     state: f.location.state(),
  //     userId: user.id,
  //   });

  //   //contact
  //   await db.insert(schema.subscribersContacts).values({
  //     primaryPhoneNumber: f.string.numeric({
  //       length: 10,
  //       exclude: ["2", "3"],
  //       allowLeadingZeros: false,
  //     }),
  //     secondaryPhoneNumber: f.string.numeric({
  //       length: 10,
  //       exclude: ["2", "3"],
  //       allowLeadingZeros: false,
  //     }),
  //     userId: user.id,
  //   });

  //   //bank account
  //   await db.insert(schema.subscribersBankAccounts).values({
  //     accountHolderName: `${user.firstName?.toUpperCase()} ${user.lastName?.toUpperCase()}`,
  //     accountNumber: f.string.numeric(12),
  //     branchName: f.location.streetAddress(),
  //     ifscCode: `${f.helpers.arrayElement(["SBI", "CNR", "UTI", "PNB"])}${f.string.numeric(6)}`,
  //     upiId: `${f.string.numeric({
  //       length: 10,
  //       exclude: ["2", "3"],
  //       allowLeadingZeros: false,
  //     })}@${f.helpers.arrayElement(["ybl", "axs", "oicici", "samsung"])}`,
  //     accountType: f.helpers.arrayElement(["savings", "current"]),
  //     city: f.location.city(),
  //     pincode: f.location.zipCode("######"),
  //     state: f.location.state(),
  //     userId: user.id,
  //   });
  // }

  // Subscriber joining the batches
  const batches = await db.query.batches.findMany();

  const subscribers = await db.query.subscribers.findMany();

  await Promise.all(
    batches.map(async (batch) => {
      const randomSubs = f.helpers.arrayElements(subscribers, {
        min: 20,
        max: batch.scheme,
      });

      console.log(`${randomSubs.length} subscribers joining ${batch.name} 👥`);

      console.log(`Subscriber making few payments for ${batch.name} \n`);

      const runwayDates = Array.from({ length: 10 }).map((_, i) => {
        return addMonths(batch.startsOn, i);
      });

      //Payouts
      await Promise.all(
        randomSubs.map(async (sub, index) => {
          const subscribersToBatch = await db
            .insert(schema.subscribersToBatches)
            .values({
              subscriberId: sub.id,
              batchId: batch.id,
              commissionRate: batch.defaultCommissionRate,
            })
            .returning();

          randomSubs.map(async (sub, index) => {
            runwayDates.map(async (rd) => {
              const deductions = f.helpers.arrayElement([200, 400, 1000, 2000]);
              const amount = parseInt(batch.fundAmount);
              const payoutStatus = f.helpers.arrayElement([
                "requested",
                "accepted",
                "rejected",
                "cancelled",
                "disbursed",
              ]);

              await db.insert(schema.payouts).values({
                amount,
                month: rd.toDateString(),
                subscriberToBatchId: subscribersToBatch.at(0)!.id,
                deductions,
                totalAmount: amount - deductions,
                payoutStatus,
                paymentMode: "cash",
              });
            });
          });
        })
      );

      //Payments
      // randomSubs.map(async (sub, index) => {randomSubs.map(async (sub, index) => {
      //     const subscribersToBatch = await db
      //       .insert(schema.subscribersToBatches)
      //       .values({
      //         subscriberId: sub.id,
      //         batchId: batch.id,
      //         commissionRate: batch.defaultCommissionRate,
      //       })
      //       .returning();

      //     const randomDates = f.helpers.arrayElements(runwayDates, 10);

      //     //Payments
      //     await Promise.all(
      //       randomDates.map((runwayDate) => {
      //         const paidOn = f.date.between({
      //           from: batch.startsOn,
      //           to: addMonths(batch.startsOn, batch.scheme),
      //         });

      //         const creditScoreAffected = runwayDate > paidOn ? 20 : -10;

      //         const penalty =
      //           runwayDate < paidOn
      //             ? f.helpers.arrayElement([200, 300, 400, 500, 600])
      //             : 0;

      //         const subscriptionAmount = Math.ceil(
      //           parseInt(batch.fundAmount) / batch.scheme
      //         );

      //         const totalAmount = subscriptionAmount + penalty;

      //         const paymentMode = f.helpers.arrayElement([
      //           "cash",
      //           "upi/bank",
      //           "cheque",
      //         ]);

      //         const transactionId =
      //           paymentMode === "upi/bank" ? f.finance.iban() : null;

      //         return db.insert(schema.payments).values({
      //           runwayDate: runwayDate.toDateString(),
      //           creditScoreAffected,
      //           paidOn: paidOn.toDateString(),
      //           subscriptionAmount,
      //           subscriberToBatchId: subscribersToBatch.at(0)!.id,
      //           totalAmount,
      //           paymentMode,
      //           transactionId,
      //           penalty,
      //         });
      //       })
      //     );

      //     //Payouts ...
      //   })
      // );
    })
  );
}

main()
  .then(() => console.log("Seed completed successfully ✅"))
  .catch((e) => console.error(e))
  .finally(() =>
    console.log("\n\n...................NAMASTE 🙏.....................\n\n")
  );
