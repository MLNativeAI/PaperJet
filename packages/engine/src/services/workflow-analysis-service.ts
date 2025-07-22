import { db } from "@paperjet/db";
import { file, workflow } from "@paperjet/db/schema";
import { logger } from "@paperjet/shared";
import { eq } from "drizzle-orm";
import { s3Client } from "../lib/s3";
import type { WorkflowConfiguration } from "../types";
import { performCompleteAnalysis } from "./internal/document-analysis-service";
import { runDocumentExtraction } from "./internal/document-extraction-service";
import { convertDocumentToMarkdown, type MarkdownDocument } from "./internal/markdown-service";

// since we're not saving the extracted markdown data on the workflow level (maybe we should, alongside sample data), we need a way to support re-extracting data without having to parse into markdown again
const localMarkdownCache = new Map<string, MarkdownDocument>();

export async function analyzeWorkflowDocument(workflowId: string): Promise<void> {
  logger.info("Starting workflow document analysis");

  // Get workflow and associated file
  const [workflowData] = await db
    .select({
      workflowId: workflow.id,
      workflowName: workflow.slug,
      fileId: workflow.fileId,
      filename: file.filename,
      ownerId: workflow.ownerId,
    })
    .from(workflow)
    .leftJoin(file, eq(workflow.fileId, file.id))
    .where(eq(workflow.id, workflowId));

  if (!workflowData) {
    throw new Error("Workflow not found");
  }

  if (!workflowData.fileId || !workflowData.filename) {
    throw new Error("No file associated with this workflow");
  }

  const presignedUrl = s3Client.presign(workflowData.filename);

  try {
    const markdownDocument = await convertDocumentToMarkdown(presignedUrl);
    localMarkdownCache.set(workflowId, markdownDocument);
    // Use the document analysis service to perform complete analysis
    const analysisResult = await performCompleteAnalysis(markdownDocument);
    // Update workflow configuration with analysis results and set status to extracting
    const configuration: WorkflowConfiguration = {
      fields: analysisResult.fields,
      tables: analysisResult.tables,
    };

    await db
      .update(workflow)
      .set({
        slug: analysisResult.workflowName,
        description: analysisResult.description,
        categories: JSON.stringify(analysisResult.categories),
        configuration: JSON.stringify(configuration),
        status: "extracting",
        updatedAt: new Date(),
      })
      .where(eq(workflow.id, workflowId));

    logger.info("Workflow document analysis completed, triggering data extraction");

    await extractDataFromDocument(workflowId, configuration);

    // Update workflow status to configuring after extraction
    await db
      .update(workflow)
      .set({
        status: "configuring",
        updatedAt: new Date(),
      })
      .where(eq(workflow.id, workflowId));
  } catch (error) {
    logger.error(error, "Document analysis has failed");
    await db
      .update(workflow)
      .set({
        status: "failed",
        updatedAt: new Date(),
      })
      .where(eq(workflow.id, workflowId));
  }
}

export async function extractDataFromDocument(workflowId: string, configuration: WorkflowConfiguration) {
  logger.info("Starting data extraction from document");

  const workflowDocument = localMarkdownCache.get(workflowId);

  if (!workflowDocument) {
    throw new Error("Extracted document not found");
  }

  // Use the document extraction service
  const extractionResult = await runDocumentExtraction(workflowDocument, configuration);

  logger.info("Data extraction from document completed", {
    workflowId,
    extractedFieldsCount: extractionResult.fields.length,
    extractedTablesCount: extractionResult.tables.length,
  });

  // Store sample data in workflow_sample table
  await db
    .update(workflow)
    .set({
      sampleData: JSON.stringify(extractionResult),
      sampleDataExtractedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(workflow.id, workflowId));

  // Update workflow status to configuring after extraction
  await db
    .update(workflow)
    .set({
      status: "configuring",
      updatedAt: new Date(),
    })
    .where(eq(workflow.id, workflowId));

  logger.info("Analysis extraction completed");
}
