CREATE TYPE "public"."payment_mode_enum" AS ENUM('cash', 'upi/bank', 'cheque');--> statement-breakpoint
CREATE TYPE "public"."payout_status_enum" AS ENUM('requested', 'accepted', 'rejected', 'disbursed', 'cancelled');--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"subscriber_to_batch_id" text NOT NULL,
	"runway_date" date NOT NULL,
	"penalty" numeric(3) DEFAULT 0 NOT NULL,
	"subscription_amount" numeric(3) NOT NULL,
	"total_amount" numeric(3) NOT NULL,
	"payment_mode" "payment_mode_enum" DEFAULT 'cash' NOT NULL,
	"transaction_id" text,
	"credit_score_affected" integer NOT NULL,
	"paid_on" date DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payouts" (
	"id" text PRIMARY KEY NOT NULL,
	"subscriber_to_batch_id" text NOT NULL,
	"month" date NOT NULL,
	"deductions" numeric(3) DEFAULT 0 NOT NULL,
	"amount" numeric(3) NOT NULL,
	"total_amount" numeric(3) NOT NULL,
	"payout_status" "payout_status_enum" DEFAULT 'requested' NOT NULL,
	"payment_mode" "payment_mode_enum" DEFAULT 'cash' NOT NULL,
	"transaction_id" text,
	"requested_at" timestamp,
	"accepted_at" timestamp,
	"cancelled_at" timestamp,
	"rejection_reason" text,
	"disbursed_at" timestamp,
	"rejected_at" timestamp,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscriber_to_batch_id_subscribers_to_batches_id_fk" FOREIGN KEY ("subscriber_to_batch_id") REFERENCES "public"."subscribers_to_batches"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_subscriber_to_batch_id_subscribers_to_batches_id_fk" FOREIGN KEY ("subscriber_to_batch_id") REFERENCES "public"."subscribers_to_batches"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "payments_subscriber_to_batch_id_index" ON "payments" USING btree ("subscriber_to_batch_id");--> statement-breakpoint
CREATE INDEX "payouts_subscriber_to_batch_id_index" ON "payouts" USING btree ("subscriber_to_batch_id");