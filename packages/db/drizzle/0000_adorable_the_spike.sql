CREATE SCHEMA "collectors";
--> statement-breakpoint
CREATE SCHEMA "subscribers";
--> statement-breakpoint
CREATE TYPE "public"."account_type_enum" AS ENUM('savings', 'current');--> statement-breakpoint
CREATE TYPE "public"."batch_status_enum" AS ENUM('active', 'completed');--> statement-breakpoint
CREATE TYPE "public"."batch_type_enum" AS ENUM('interest', 'auction');--> statement-breakpoint
CREATE TABLE "collectors"."collectors" (
	"id" text PRIMARY KEY NOT NULL,
	"date_of_birth" date NOT NULL,
	"org_name" text NOT NULL,
	"org_certificate_key" text NOT NULL,
	"aadhar_front_file_key" text NOT NULL,
	"aadhar_back_file_key" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collectors"."addresses" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"address_line" text NOT NULL,
	"pincode" numeric NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collectors"."bank_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_number" text NOT NULL,
	"account_holder_name" text NOT NULL,
	"account_type" "account_type_enum" DEFAULT 'savings' NOT NULL,
	"upi_id" text NOT NULL,
	"branch_name" text NOT NULL,
	"ifsc_code" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"pincode" numeric NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collectors"."contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"primary_phone_number" numeric NOT NULL,
	"secondary_phone_number" numeric,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "batches" (
	"id" text PRIMARY KEY NOT NULL,
	"collector_id" text,
	"name" text NOT NULL,
	"batch_type" "batch_type_enum" DEFAULT 'interest' NOT NULL,
	"due_on" numeric NOT NULL,
	"starts_on" date NOT NULL,
	"ends_on" date NOT NULL,
	"scheme" integer NOT NULL,
	"fund_amount" numeric NOT NULL,
	"default_commission_rate" numeric(3, 1) NOT NULL,
	"batch_status" "batch_status_enum" DEFAULT 'active' NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers_to_batches" (
	"id" text PRIMARY KEY NOT NULL,
	"batch_id" text NOT NULL,
	"subscriber_id" text NOT NULL,
	"chit_id" text NOT NULL,
	"commission_rate" numeric(3, 1) NOT NULL,
	"is_freezed" boolean DEFAULT false,
	"freezed_at" timestamp,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers"."subscribers" (
	"id" text PRIMARY KEY NOT NULL,
	"face_id" text NOT NULL,
	"date_of_birth" date NOT NULL,
	"pan_card_number" text NOT NULL,
	"nominee_name" text NOT NULL,
	"nominee_relationship" text NOT NULL,
	"aadhar_front_file_key" text NOT NULL,
	"aadhar_back_file_key" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_faceId_unique" UNIQUE("face_id"),
	CONSTRAINT "subscribers_panCardNumber_unique" UNIQUE("pan_card_number")
);
--> statement-breakpoint
CREATE TABLE "subscribers"."addresses" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"address_line" text NOT NULL,
	"pincode" numeric NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers"."bank_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_number" text NOT NULL,
	"account_holder_name" text NOT NULL,
	"account_type" "account_type_enum" DEFAULT 'savings' NOT NULL,
	"upi_id" text NOT NULL,
	"branch_name" text NOT NULL,
	"ifsc_code" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"pincode" numeric NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers"."subscribersContacts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"primary_phone_number" numeric NOT NULL,
	"secondary_phone_number" numeric,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "collectors"."addresses" ADD CONSTRAINT "addresses_user_id_collectors_id_fk" FOREIGN KEY ("user_id") REFERENCES "collectors"."collectors"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "collectors"."bank_accounts" ADD CONSTRAINT "bank_accounts_user_id_collectors_id_fk" FOREIGN KEY ("user_id") REFERENCES "collectors"."collectors"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "collectors"."contacts" ADD CONSTRAINT "contacts_user_id_collectors_id_fk" FOREIGN KEY ("user_id") REFERENCES "collectors"."collectors"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "batches" ADD CONSTRAINT "batches_collector_id_collectors_id_fk" FOREIGN KEY ("collector_id") REFERENCES "collectors"."collectors"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subscribers_to_batches" ADD CONSTRAINT "subscribers_to_batches_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subscribers_to_batches" ADD CONSTRAINT "subscribers_to_batches_subscriber_id_subscribers_id_fk" FOREIGN KEY ("subscriber_id") REFERENCES "subscribers"."subscribers"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subscribers"."addresses" ADD CONSTRAINT "addresses_user_id_subscribers_id_fk" FOREIGN KEY ("user_id") REFERENCES "subscribers"."subscribers"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subscribers"."bank_accounts" ADD CONSTRAINT "bank_accounts_user_id_subscribers_id_fk" FOREIGN KEY ("user_id") REFERENCES "subscribers"."subscribers"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subscribers"."subscribersContacts" ADD CONSTRAINT "subscribersContacts_user_id_subscribers_id_fk" FOREIGN KEY ("user_id") REFERENCES "subscribers"."subscribers"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "chitId_unique_batch" ON "subscribers_to_batches" USING btree ("chit_id","batch_id");--> statement-breakpoint
CREATE INDEX "subscribers_index" ON "subscribers"."subscribers" USING btree ("face_id","id");