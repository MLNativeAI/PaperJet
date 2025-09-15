import { db } from "@db/db";
import { documentData, documentPage, file, workflow, workflowExecution } from "@db/schema";
import type {
  ExecutionStatusResponse,
  ExtractedDataType,
  WorkflowExecutionData,
  WorkflowExecutionRow,
} from "@db/types/executions";
import { DbDocumentData } from "@db/types/tables";
import { generateId, ID_PREFIXES } from "@paperjet/shared/id";
import { and, desc, eq } from "drizzle-orm";

export async function getFileByWorkflowExecutionId({
  workflowExecutionId,
}: {
  workflowExecutionId: string;
}): Promise<{ filePath: string; ownerId: string }> {
  const result = await db
    .select({
      filePath: file.filePath,
      ownerId: file.ownerId,
    })
    .from(file)
    .leftJoin(workflowExecution, eq(workflowExecution.fileId, file.id))
    .where(eq(workflowExecution.id, workflowExecutionId))
    .limit(1);

  if (result.length === 0 || !result[0]?.filePath || !result[0]?.ownerId) {
    throw new Error("File is missing");
  }
  return result[0];
}

export async function getFile({
  workflowExecutionId,
  organizationId,
}: {
  workflowExecutionId: string;
  organizationId: string;
}) {
  const result = await db
    .select({
      filePath: file.filePath,
    })
    .from(file)
    .leftJoin(workflowExecution, eq(workflowExecution.fileId, file.id))
    .where(and(eq(workflowExecution.id, workflowExecutionId), eq(file.ownerId, organizationId)))
    .limit(1);

  if (result.length === 0 || !result[0]?.filePath) {
    throw new Error("File not found");
  }
  return result[0];
}

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

export async function getWorkflow({ workflowId }: { workflowId: string }) {
  const workflowData = await db.query.workflow.findFirst({
    where: eq(workflow.id, workflowId),
  });
  if (!workflowData) {
    throw new Error("Workflow not found");
  }
  return workflowData;
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

export async function updateExecutionJobId({ executionId, jobId }: { executionId: string; jobId: string }) {
  await db
    .update(workflowExecution)
    .set({
      jobId,
    })
    .where(eq(workflowExecution.id, executionId));
}

export async function getWorkflowExecutionById({
  workflowExecutionId,
  userId,
}: {
  workflowExecutionId: string;
  userId: string;
}) {
  const exeuction = await db.query.workflowExecution.findFirst({
    where: and(eq(workflowExecution.id, workflowExecutionId), eq(workflowExecution.ownerId, userId)),
  });
  if (!exeuction) {
    throw new Error("not found");
  }
  return exeuction;
}

export async function getAllWorkflowExecutions({ userId }: { userId: string }): Promise<WorkflowExecutionRow[]> {
  const executions = await db
    .select({
      id: workflowExecution.id,
      workflowId: workflowExecution.workflowId,
      workflowName: workflow.name,
      fileId: workflowExecution.fileId,
      fileName: file.fileName,
      jobId: workflowExecution.jobId,
      status: workflowExecution.status,
      errorMessage: workflowExecution.errorMessage,
      startedAt: workflowExecution.startedAt,
      completedAt: workflowExecution.completedAt,
      createdAt: workflowExecution.createdAt,
      ownerId: workflowExecution.ownerId,
    })
    .from(workflowExecution)
    .leftJoin(workflow, eq(workflowExecution.workflowId, workflow.id))
    .leftJoin(file, eq(workflowExecution.fileId, file.id))
    .where(eq(workflowExecution.ownerId, userId))
    .orderBy(desc(workflowExecution.createdAt));

  return executions.map((execution) => ({
    ...execution,
    workflowName: execution.workflowName || "Unknown Workflow",
    fileName: execution.fileName || "Unknown File",
    startedAt: execution.startedAt.toISOString(),
    completedAt: execution.completedAt?.toISOString() || null,
    createdAt: execution.createdAt.toISOString(),
  }));
}

export async function getWorkflowExecutionWithExtractedData({
  workflowExecutionId,
  userId,
}: {
  workflowExecutionId: string;
  userId: string;
}): Promise<WorkflowExecutionData> {
  const result = await db
    .select({
      id: workflowExecution.id,
      workflowId: workflowExecution.workflowId,
      workflowName: workflow.name,
      fileId: workflowExecution.fileId,
      fileName: file.fileName,
      jobId: workflowExecution.jobId,
      status: workflowExecution.status,
      errorMessage: workflowExecution.errorMessage,
      startedAt: workflowExecution.startedAt,
      completedAt: workflowExecution.completedAt,
      createdAt: workflowExecution.createdAt,
      ownerId: workflowExecution.ownerId,
      extractedData: documentData.extractedData,
    })
    .from(workflowExecution)
    .leftJoin(workflow, eq(workflowExecution.workflowId, workflow.id))
    .leftJoin(file, eq(workflowExecution.fileId, file.id))
    .leftJoin(documentData, eq(documentData.workflowExecutionId, workflowExecution.id))
    .where(and(eq(workflowExecution.id, workflowExecutionId), eq(workflowExecution.ownerId, userId)));

  const execution = result[0];
  if (!execution) {
    throw new Error("not found");
  }

  return {
    ...execution,
    workflowName: execution.workflowName || "Unknown Workflow",
    fileName: execution.fileName || "Unknown File",
    startedAt: execution.startedAt.toISOString(),
    completedAt: execution.completedAt?.toISOString() || null,
    createdAt: execution.createdAt.toISOString(),
    extractedData: execution.extractedData as unknown as ExtractedDataType,
  };
}

export async function getWorkflowExecutionStatus({
  workflowExecutionId,
  organizationId,
}: {
  workflowExecutionId: string;
  organizationId: string;
}): Promise<ExecutionStatusResponse> {
  const result = await db
    .select({
      id: workflowExecution.id,
      workflowId: workflowExecution.workflowId,
      fileId: workflowExecution.fileId,
      jobId: workflowExecution.jobId,
      status: workflowExecution.status,
      errorMessage: workflowExecution.errorMessage,
      startedAt: workflowExecution.startedAt,
      completedAt: workflowExecution.completedAt,
      createdAt: workflowExecution.createdAt,
    })
    .from(workflowExecution)
    .where(and(eq(workflowExecution.id, workflowExecutionId), eq(workflowExecution.ownerId, organizationId)));

  const execution = result[0];
  if (!execution) {
    throw new Error("not found");
  }

  return {
    ...execution,
    startedAt: execution.startedAt.toISOString(),
    completedAt: execution.completedAt?.toISOString() || null,
  };
}
