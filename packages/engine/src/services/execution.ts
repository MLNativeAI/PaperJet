import { db } from "@paperjet/db";
import { documentData, workflowExecution } from "@paperjet/db/schema";
import { and, eq } from "drizzle-orm";

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

export async function getWorkflowExecutionWithExtractedData(workflowExecutionId: string, userId: string) {
  const execution = await db.query.workflowExecution.findFirst({
    where: and(eq(workflowExecution.id, workflowExecutionId), eq(workflowExecution.ownerId, userId)),
  });
  if (!execution) {
    throw new Error("not found");
  }

  const docData = await db.query.documentData.findFirst({
    where: eq(documentData.workflowExecutionId, workflowExecutionId),
  });

  return {
    ...execution,
    documentData: docData ? docData.extractedData : null,
  };
}
