CREATE TYPE "public"."modelType" AS ENUM('cloud', 'custom');--> statement-breakpoint
CREATE TABLE "configuration" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_exists" boolean DEFAULT false NOT NULL,
	"modelType" "modelType" DEFAULT 'cloud' NOT NULL,
	"gemini_api_key" text,
	"custom_model_url" text,
	"custom_model_name" text,
	"custom_model_token" text
);
