import { db } from "@paperjet/db";
import { workflowExecution } from "@paperjet/db/schema";
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
