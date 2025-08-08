CREATE TABLE "document_data" (
	"id" text PRIMARY KEY NOT NULL,
	"raw_markdown" text,
	"workflow_execution_id" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_page" (
	"id" text PRIMARY KEY NOT NULL,
	"document_data_id" text NOT NULL,
	"workflow_execution_id" text,
	"page_number" integer NOT NULL,
	"raw_markdown" text
);
--> statement-breakpoint
ALTER TABLE "workflow_execution" ADD COLUMN "jobId" text;--> statement-breakpoint
ALTER TABLE "document_data" ADD CONSTRAINT "document_data_workflow_execution_id_workflow_execution_id_fk" FOREIGN KEY ("workflow_execution_id") REFERENCES "public"."workflow_execution"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_page" ADD CONSTRAINT "document_page_document_data_id_document_data_id_fk" FOREIGN KEY ("document_data_id") REFERENCES "public"."document_data"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_page" ADD CONSTRAINT "document_page_workflow_execution_id_workflow_execution_id_fk" FOREIGN KEY ("workflow_execution_id") REFERENCES "public"."workflow_execution"("id") ON DELETE set null ON UPDATE no action;