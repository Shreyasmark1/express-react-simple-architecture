CREATE TYPE "public"."config_key" AS ENUM('allow_registration');--> statement-breakpoint
CREATE TYPE "public"."scheduler_context" AS ENUM('on_register', 'on_delete');--> statement-breakpoint
CREATE TYPE "public"."scheduler_status" AS ENUM('scheduled', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."wallet_log_context" AS ENUM('installment_commission', 'mpin_purchase', 'bank_withdrawal');--> statement-breakpoint
CREATE TYPE "public"."wallet_log_operation" AS ENUM('credit', 'debit');--> statement-breakpoint
CREATE TABLE "otp_auths" (
	"auth_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"mobile_no" varchar(10) NOT NULL,
	"token" uuid NOT NULL,
	"otp" varchar(4) NOT NULL,
	"is_expired" boolean DEFAULT false,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "config" (
	"app_config_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" "config_key" NOT NULL,
	"value" json NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheduler_jobs" (
	"sj_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"context_id" uuid NOT NULL,
	"job_context" "scheduler_context" NOT NULL,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"job_status" "scheduler_status" DEFAULT 'scheduled' NOT NULL,
	"error_stack" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"mobile_no" varchar(10) NOT NULL,
	"email" varchar NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"public_id" varchar,
	"user_image" json,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "wallet_log" (
	"wallet_log_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_id" uuid NOT NULL,
	"operation" "wallet_log_operation" NOT NULL,
	"context_id" uuid NOT NULL,
	"wallet_log_context" "wallet_log_context" NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallet" (
	"wallet_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"current_balance" numeric(10, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wallet_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "otp_auths" ADD CONSTRAINT "otp_auths_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_log" ADD CONSTRAINT "wallet_log_wallet_id_wallet_wallet_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallet"("wallet_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_log" ADD CONSTRAINT "wallet_log_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;