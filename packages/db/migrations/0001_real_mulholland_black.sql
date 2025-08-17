ALTER TABLE "document_data" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "document_data" ADD COLUMN "extractedData" jsonb;--> statement-breakpoint
ALTER TABLE "document_data" ADD COLUMN "workflow_id" text;--> statement-breakpoint
ALTER TABLE "document_data" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "document_data" ADD CONSTRAINT "document_data_workflow_id_workflow_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflow"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_execution" DROP COLUMN "extraction_result";