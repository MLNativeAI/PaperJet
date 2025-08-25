import { db } from "@paperjet/db";
import { documentData, file, workflow, workflowExecution } from "@paperjet/db/schema";
import { and, desc, eq } from "drizzle-orm";
import type { ExecutionStatusResponse, ExtractedDataType, WorkflowExecutionData, WorkflowExecutionRow } from "../types";
import { exportData } from "./export";
import { s3Client } from "../lib/s3";

export async function updateExecutionJobId(executionId: string, jobId: string) {
  await db
    .update(workflowExecution)
    .set({
      jobId,
    })
    .where(eq(workflowExecution.id, executionId));
}

export async function getWorkflowExecutionById(workflowExecutionId: string, userId: string) {
  const exeuction = await db.query.workflowExecution.findFirst({
    where: and(eq(workflowExecution.id, workflowExecutionId), eq(workflowExecution.ownerId, userId)),
  });
  if (!exeuction) {
    throw new Error("not found");
  }
  return exeuction;
}

export async function getAllWorkflowExecutions(userId: string): Promise<WorkflowExecutionRow[]> {
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

export async function getWorkflowExecutionWithExtractedData(
  workflowExecutionId: string,
  userId: string,
): Promise<WorkflowExecutionData> {
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

export async function getWorkflowExecutionStatus(
  workflowExecutionId: string,
  userId: string,
): Promise<ExecutionStatusResponse> {
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
    .where(and(eq(workflowExecution.id, workflowExecutionId), eq(workflowExecution.ownerId, userId)));

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

export async function exportExecution(workflowExecutionId: string, mode: "csv" | "json", userId: string) {
  const executionData = await db.query.documentData.findFirst({
    where: and(eq(documentData.workflowExecutionId, workflowExecutionId), eq(documentData.ownerId, userId)),
  });

  if (!executionData) {
    throw new Error("Workflow execution data not found");
  }
  const data: ExtractedDataType = executionData.extractedData as unknown as ExtractedDataType;
  return exportData(data, mode, workflowExecutionId);
}

export async function getPresignedFileUrl(workflowExecutionId: string, userId: string) {
  const result = await db
    .select({
      filePath: file.filePath,
    })
    .from(file)
    .leftJoin(workflowExecution, eq(workflowExecution.fileId, file.id))
    .where(and(eq(workflowExecution.id, workflowExecutionId), eq(file.ownerId, userId)))
    .limit(1);

  if (result.length === 0 || !result[0]?.filePath) {
    throw new Error("File not found");
  }

  const presignedUrl = s3Client.presign(result[0]?.filePath);

  return {
    documentUrl: presignedUrl,
  };
}
