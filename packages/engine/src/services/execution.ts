import { db } from "@paperjet/db";
import { workflowExecution } from "@paperjet/db/schema";
import { eq } from "drizzle-orm";

export async function updateExecutionJobId(executionId: string, jobId: string) {
  await db
    .update(workflowExecution)
    .set({
      jobId,
    })
    .where(eq(workflowExecution.id, executionId));
}
