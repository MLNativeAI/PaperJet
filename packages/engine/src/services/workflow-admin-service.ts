import { db } from "@paperjet/db";
import { file, workflow, workflowExecution } from "@paperjet/db/schema";
import { generateId, ID_PREFIXES } from "@paperjet/shared/id";
import { and, eq } from "drizzle-orm";
import { s3Client } from "../lib/s3";
import { type Workflow, type WorkflowConfiguration, WorkflowExecutionStatus } from "../types";

export async function getWorkflows(userId: string): Promise<Workflow[]> {
  const workflows = await db.select().from(workflow).where(eq(workflow.ownerId, userId));
  return workflows.map((workflow) => {
    return {
      ...workflow,
      createdAt: workflow.createdAt.toISOString(),
      updatedAt: workflow.updatedAt.toISOString(),
      configuration: workflow.configuration as WorkflowConfiguration,
    };
  });
}

export async function getWorkflow(workflowId: string, userId: string): Promise<Workflow> {
  const [workflowData] = await db.select().from(workflow).where(eq(workflow.id, workflowId));

  if (!workflowData || workflowData.ownerId !== userId) {
    throw new Error("Workflow not found");
  }

  return {
    ...workflowData,
    createdAt: workflowData.createdAt.toISOString(),
    updatedAt: workflowData.updatedAt.toISOString(),
    configuration: workflowData.configuration as WorkflowConfiguration,
  };
}

export async function getDocumentForFile(fileId: string, userId: string) {
  // Get file from database
  const [fileRecord] = await db.select().from(file).where(eq(file.id, fileId));

  if (!fileRecord || fileRecord.ownerId !== userId) {
    throw new Error("File not found");
  }

  // Get presigned URL for the file
  const presignedUrl = s3Client.presign(fileRecord.fileName);

  const result = {
    fileId,
    filename: fileRecord.fileName,
    presignedUrl,
  };

  return result;
}

export async function uploadFileAndCreateExecution(
  workflowId: string,
  organizationId: string,
  userId: string,
  uploadedFile: File,
) {
  const [workflowData] = await db
    .select()
    .from(workflow)
    .where(and(eq(workflow.id, workflowId), eq(workflow.ownerId, organizationId)));

  if (!workflowData) {
    throw new Error("Workflow not found");
  }

  const executionId = generateId(ID_PREFIXES.workflowExecution);
  const fileId = generateId(ID_PREFIXES.file);
  const filePath = `executions/${executionId}/${uploadedFile.name}`;

  await s3Client.file(filePath).write(await uploadedFile.arrayBuffer());
  await db.insert(file).values({
    id: fileId,
    fileName: uploadedFile.name,
    filePath: filePath,
    ownerId: organizationId,
    createdAt: new Date(),
  });

  await db.insert(workflowExecution).values({
    id: executionId,
    workflowId,
    fileId,
    status: WorkflowExecutionStatus.enum.Queued,
    startedAt: new Date(),
    createdAt: new Date(),
    ownerId: organizationId,
    creatorId: userId,
  });

  return {
    workflowExecutionId: executionId,
    workflowId,
    status: WorkflowExecutionStatus.enum.Queued,
    fileId,
    filename: uploadedFile.name,
  };
}

export async function deleteWorkflow(workflowId: string, userId: string) {
  // Check if workflow exists and user owns it
  const [existingWorkflow] = await db.select().from(workflow).where(eq(workflow.id, workflowId));

  if (!existingWorkflow || existingWorkflow.ownerId !== userId) {
    throw new Error("Workflow not found");
  }
  // Delete the workflow itself
  await db.delete(workflow).where(eq(workflow.id, workflowId));
}

export async function createWorkflowFromApi(
  name: string,
  description: string,
  configuration: WorkflowConfiguration,
  organizationId: string,
  userId: string,
): Promise<{
  workflowId: string;
}> {
  const workflowId = generateId(ID_PREFIXES.workflow);
  const newWorkflowData = {
    id: workflowId,
    name: name,
    description: description || "",
    configuration: configuration,
    ownerId: organizationId,
    creatorId: userId,
  };

  await db.insert(workflow).values(newWorkflowData);
  return { workflowId };
}

export async function updateWorkflow(
  workflowId: string,
  name: string,
  description: string,
  configuration: WorkflowConfiguration,
  organizationId: string,
): Promise<void> {
  await db
    .update(workflow)
    .set({
      name: name,
      description: description,
      configuration: configuration,
    })
    .where(and(eq(workflow.id, workflowId), eq(workflow.ownerId, organizationId)));
}
