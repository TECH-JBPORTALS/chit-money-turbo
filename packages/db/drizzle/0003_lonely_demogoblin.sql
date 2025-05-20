ALTER TABLE "payments" ALTER COLUMN "paid_on" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "paid_on" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "paid_on" DROP NOT NULL;