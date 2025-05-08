ALTER TABLE "payouts" RENAME COLUMN "accepted_at" TO "approved_at";--> statement-breakpoint
ALTER TABLE "payouts" ALTER COLUMN "payout_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "payouts" ALTER COLUMN "payout_status" SET DEFAULT 'requested'::text;--> statement-breakpoint
DROP TYPE "public"."payout_status_enum";--> statement-breakpoint
CREATE TYPE "public"."payout_status_enum" AS ENUM('requested', 'rejected', 'disbursed', 'cancelled', 'approved');--> statement-breakpoint
ALTER TABLE "payouts" ALTER COLUMN "payout_status" SET DEFAULT 'requested'::"public"."payout_status_enum";--> statement-breakpoint
ALTER TABLE "payouts" ALTER COLUMN "payout_status" SET DATA TYPE "public"."payout_status_enum" USING "payout_status"::"public"."payout_status_enum";--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "penalty" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "subscription_amount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "total_amount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "payouts" ALTER COLUMN "deductions" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "payouts" ALTER COLUMN "amount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "payouts" ALTER COLUMN "total_amount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "payouts" ADD COLUMN "applied_commission_rate" numeric(3, 1) NOT NULL;