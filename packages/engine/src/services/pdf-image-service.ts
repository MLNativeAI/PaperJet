import { db } from "@paperjet/db";
import { documentData, documentPage, file, workflowExecution } from "@paperjet/db/schema";
import { envVars, logger } from "@paperjet/shared";
import { eq } from "drizzle-orm";
import { s3Client } from "../lib/s3";
import type { PdfSplitResult } from "../types";
import { generateId, ID_PREFIXES } from "../utils/id";

export async function splitPdfIntoImages(workflowExecutionId: string) {
  const result = await db
    .select({
      filename: file.fileName,
    })
    .from(file)
    .leftJoin(workflowExecution, eq(workflowExecution.fileId, file.id))
    .where(eq(workflowExecution.id, workflowExecutionId))
    .limit(1);

  if (result.length === 0 || !result[0]?.filename) {
    throw new Error("File is missing");
  }

  const filename = result[0].filename;
  const presignedUrl = s3Client.presign(filename);

  const formData = new FormData();
  formData.set("presigned_url", presignedUrl);
  const response = await fetch(`${envVars.ML_SERVICE_URL}/split-pdf`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    logger.error(`Failed to split PDF: ${response.status}`);
    throw new Error("Split PDF has failed");
  }

  const splitResult = (await response.json()) as unknown as PdfSplitResult;
  const documentDataId = generateId(ID_PREFIXES.documentData);

  await db.insert(documentData).values({
    id: documentDataId,
    workflowExecutionId: workflowExecutionId,
    createdAt: new Date(),
  });

  for (const page of splitResult.pages) {
    const pageId = generateId(ID_PREFIXES.page);
    const pageFileName = `executions/${workflowExecutionId}/pages/page-${page.page_number}.png`;

    await s3Client.write(pageFileName, Buffer.from(page.image_data, "base64"));

    await db.insert(documentPage).values({
      id: pageId,
      pageNumber: page.page_number,
      workflowExecutionId: workflowExecutionId,
      documentDataId: documentDataId,
    });
  }
}
