import { db } from "@db/db";
import { documentData, documentPage } from "../schema";
import { generateId, ID_PREFIXES } from "@paperjet/shared/id";
import { and, eq } from "drizzle-orm";
import { DbDocumentData } from "@db/types/tables";

export async function createDocumentData({
  workflowExecutionId,
  organizationId,
}: {
  workflowExecutionId: string;
  organizationId: string;
}): Promise<DbDocumentData> {
  const documentDataId = generateId(ID_PREFIXES.documentData);

  const result = await db
    .insert(documentData)
    .values({
      id: documentDataId,
      workflowExecutionId: workflowExecutionId,
      ownerId: organizationId,
      createdAt: new Date(),
    })
    .returning();
  if (!result[0]) {
    throw new Error("Failed to create document data");
  }
  return result[0];
}

export async function createDocumentPage({
  pageNumber,
  workflowExecutionId,
  documentDataId,
}: {
  pageNumber: number;
  workflowExecutionId: string;
  documentDataId: string;
}) {
  const pageId = generateId(ID_PREFIXES.page);
  await db.insert(documentPage).values({
    id: pageId,
    pageNumber: pageNumber,
    workflowExecutionId: workflowExecutionId,
    documentDataId: documentDataId,
  });
}

export async function updateDocumentData({
  extractedData,
  documentDataId,
}: {
  extractedData: any;
  documentDataId: string;
}) {
  await db
    .update(documentData)
    .set({
      extractedData: extractedData,
    })
    .where(eq(documentData.id, documentDataId));
}

export async function updateDocumentPageData({
  documentPageId,
  rawMarkdown,
}: {
  documentPageId: string;
  rawMarkdown: string;
}) {
  await db
    .update(documentPage)
    .set({
      rawMarkdown: rawMarkdown,
    })
    .where(eq(documentPage.id, documentPageId));
}

export async function getDocumentPageById({ documentPageId }: { documentPageId: string }) {
  const pageData = await db.query.documentPage.findFirst({
    where: and(eq(documentPage.id, documentPageId)),
  });

  if (!pageData) {
    throw new Error("Page data not found");
  }
  return pageData;
}

export async function getDocumentData({ workflowExecutionId }: { workflowExecutionId: string }) {
  const executionData = await db.query.documentData.findFirst({
    where: and(eq(documentData.workflowExecutionId, workflowExecutionId)),
  });

  if (!executionData) {
    throw new Error("Workflow execution data not found");
  }
  return executionData;
}

export async function getDocumentDataByOwner({
  workflowExecutionId,
  organizationId,
}: {
  workflowExecutionId: string;
  organizationId: string;
}) {
  const executionData = await db.query.documentData.findFirst({
    where: and(eq(documentData.workflowExecutionId, workflowExecutionId), eq(documentData.ownerId, organizationId)),
  });

  if (!executionData) {
    throw new Error("Workflow execution data not found");
  }
  return executionData;
}
