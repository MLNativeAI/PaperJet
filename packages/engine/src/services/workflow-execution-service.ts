import { db } from "@paperjet/db";
import { file, workflow, workflowExecution } from "@paperjet/db/schema";
import { and, desc, eq } from "drizzle-orm";
import type { CategoriesConfiguration, WorkflowRun } from "../types";

export async function updateExecutionJobId(executionId: string, jobId: string) {
  await db
    .update(workflowExecution)
    .set({
      jobId,
    })
    .where(eq(workflowExecution.id, executionId));
}

export async function getWorkflowExecutions(workflowId: string, _userId: string): Promise<WorkflowRun[]> {
  // Get executions with file details
  const executions = await db
    .select({
      id: workflowExecution.id,
      workflowId: workflowExecution.workflowId,
      fileId: workflowExecution.fileId,
      status: workflowExecution.status,
      extractionResult: workflowExecution.extractionResult,
      errorMessage: workflowExecution.errorMessage,
      startedAt: workflowExecution.startedAt,
      completedAt: workflowExecution.completedAt,
      createdAt: workflowExecution.createdAt,
      filename: file.filename,
      workflowName: workflow.slug,
      categories: workflow.categories,
    })
    .from(workflowExecution)
    .leftJoin(file, eq(workflowExecution.fileId, file.id))
    .leftJoin(workflow, eq(workflowExecution.workflowId, workflow.id))
    .where(eq(workflowExecution.workflowId, workflowId))
    .orderBy(desc(workflowExecution.createdAt));

  const result = executions.map((execution) => ({
    ...execution,
    workflowName: execution.workflowName ?? "Unknown",
    categories: JSON.parse(execution.categories ?? "[]") as CategoriesConfiguration,
    filename: execution.filename ? execution.filename.split("/").pop() || "Unknown" : "Unknown",
  }));

  return result;
}

export async function getAllExecutions(userId: string): Promise<WorkflowRun[]> {
  // Get all executions for user with workflow names and file details
  const executions = await db
    .select({
      id: workflowExecution.id,
      workflowId: workflowExecution.workflowId,
      fileId: workflowExecution.fileId,
      status: workflowExecution.status,
      extractionResult: workflowExecution.extractionResult,
      errorMessage: workflowExecution.errorMessage,
      startedAt: workflowExecution.startedAt,
      completedAt: workflowExecution.completedAt,
      createdAt: workflowExecution.createdAt,
      filename: file.filename,
      workflowName: workflow.slug,
      categories: workflow.categories,
    })
    .from(workflowExecution)
    .leftJoin(file, eq(workflowExecution.fileId, file.id))
    .leftJoin(workflow, eq(workflowExecution.workflowId, workflow.id))
    .where(eq(workflowExecution.ownerId, userId))
    .orderBy(desc(workflowExecution.createdAt));

  const result = executions.map((execution) => ({
    ...execution,
    workflowName: execution.workflowName ?? "Unknown",
    categories: JSON.parse(execution.categories ?? "[]") as CategoriesConfiguration,
    // Extract just the filename without the path
    filename: execution.filename ? execution.filename.split("/").pop() || "Unknown" : "Unknown",
  }));

  return result;
}

export async function getExecutionDetails(executionId: string, userId: string): Promise<WorkflowRun> {
  // Get the execution with file details
  const [executionData] = await db
    .select({
      id: workflowExecution.id,
      workflowId: workflowExecution.workflowId,
      fileId: workflowExecution.fileId,
      status: workflowExecution.status,
      extractionResult: workflowExecution.extractionResult,
      errorMessage: workflowExecution.errorMessage,
      startedAt: workflowExecution.startedAt,
      completedAt: workflowExecution.completedAt,
      createdAt: workflowExecution.createdAt,
      filename: file.filename,
      workflowName: workflow.slug,
      categories: workflow.categories,
    })
    .from(workflowExecution)
    .leftJoin(file, eq(workflowExecution.fileId, file.id))
    .leftJoin(workflow, eq(workflowExecution.workflowId, workflow.id))
    .where(and(eq(workflowExecution.ownerId, userId), eq(workflowExecution.id, executionId)));

  if (!executionData) {
    throw new Error("Execution not found");
  }

  const result = {
    ...executionData,
    // Extract just the filename without the path
    filename: executionData.filename ? executionData.filename.split("/").pop() || "Unknown" : "Unknown",
    // Parse extractionResult from JSON string to object
    extractionResult: executionData.extractionResult ? JSON.parse(executionData.extractionResult) : null,
    workflowName: executionData.workflowName ?? "Unknown",
    categories: JSON.parse(executionData.categories ?? "[]") as CategoriesConfiguration,
  };
  return result;
}

export async function deleteExecution(executionId: string, _userId: string) {
  // Get execution and verify user owns it
  const [executionData] = await db
    .select({
      id: workflowExecution.id,
      fileId: workflowExecution.fileId,
    })
    .from(workflowExecution)
    .where(eq(workflowExecution.id, executionId));

  if (!executionData) {
    throw new Error("Execution not found");
  }

  // Delete the execution
  await db.delete(workflowExecution).where(eq(workflowExecution.id, executionId));
}
