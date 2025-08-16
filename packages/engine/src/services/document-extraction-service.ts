import { db } from "@paperjet/db";
import { documentData, workflow } from "@paperjet/db/schema";
import { logger } from "@paperjet/shared";
import { eq } from "drizzle-orm";
import { generateObject } from "../lib/ai-sdk-wrapper";
import type { WorkflowConfiguration } from "../types";
import { buildExtractionSchema } from "../utils/build-extraction-schema";

export async function extractDataFromMarkdown(workflowId: string, workflowExecutionId: string) {
  logger.debug(
    {
      workflowId,
      workflowExecutionId,
    },
    "Extracting data from markdown",
  );
  const dataDoc = await db.query.documentData.findFirst({
    where: eq(documentData.workflowExecutionId, workflowExecutionId),
  });
  if (!dataDoc || !dataDoc.rawMarkdown) {
    throw new Error("Fatal error, document data not found");
  }
  const workflowData = await db.query.workflow.findFirst({
    where: eq(workflow.id, workflowId),
  });
  if (!workflowData) {
    throw new Error("Fatal error, workflow not found");
  }
  const validConfig = workflowData.configuration as WorkflowConfiguration;
  const extractionResult = await runDocumentExtraction(dataDoc.rawMarkdown, validConfig);
  logger.debug({ workflowId, workflowExecutionId, result: extractionResult }, "Extraction completed");
}

export async function runDocumentExtraction(
  markdownDocument: string,
  configuration: WorkflowConfiguration,
): Promise<any> {
  // Build dynamic schema object based on provided fields and tables
  const schemaObj = buildExtractionSchema(configuration);

  // Build extraction prompt with field descriptions
  const fieldDescriptions: string[] = [];
  const tableDescriptions: string[] = [];

  configuration.objects.forEach((obj) => {
    if ('fields' in obj) {
      obj.fields.forEach((field) => {
        fieldDescriptions.push(`- ${field.name} (${field.type})`);
      });
    }
    if ('tables' in obj) {
      obj.tables.forEach((table) => {
        const columnDescs = table.columns.map((col) => `    - ${col.name} (${col.type})`).join("\n");
        tableDescriptions.push(`- ${table.name}: ${table.description || ''}\n${columnDescs}`);
      });
    }
  });

  const prompt = `Extract the following information from this document:

FIELDS TO EXTRACT:
${fieldDescriptions.join("\n")}

${tableDescriptions.length > 0 ? `TABLES TO EXTRACT:\n${tableDescriptions.join("\n")}` : ""}

Instructions:
- Extract exact values as they appear in the document
- For currency fields, extract as numbers (remove currency symbols)
- For date fields, use ISO format (YYYY-MM-DD)
- For boolean fields, return true/false based on presence or checkmarks
- If a field is not found or unclear, return null
- For tables, extract all rows found
- Maintain data accuracy and completeness`;
  const result = await generateObject("document-extraction", {
    schema: schemaObj,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "text",
            text: markdownDocument,
          },
        ],
      },
    ],
  });

  logger.info("Data extraction completed successfully");

  return result.object;
}
