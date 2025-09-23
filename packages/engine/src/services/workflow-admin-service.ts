import { createFile, createWorkflowExecution, getAllWorkflows, getWorkflowByOwner } from "@paperjet/db";
import { type RuntimeModelType, type WorkflowConfiguration, WorkflowExecutionStatus } from "@paperjet/db/types";
import { generateId, ID_PREFIXES } from "@paperjet/shared/id";
import { s3Client } from "../lib/s3";
import type { Workflow } from "../types";

export async function getWorkflows(organizationId: string): Promise<Workflow[]> {
  const workflows = await getAllWorkflows({ organizationId });
  return workflows.map((workflow) => {
    return {
      ...workflow,
      modelType: workflow.modelType as RuntimeModelType,
      createdAt: workflow.createdAt.toISOString(),
      updatedAt: workflow.updatedAt.toISOString(),
      configuration: workflow.configuration as WorkflowConfiguration,
    };
  });
}

export async function getWorkflow(workflowId: string, organizationId: string): Promise<Workflow> {
  const workflowData = await getWorkflowByOwner({ workflowId, organizationId });
  return {
    ...workflowData,
    modelType: workflowData.modelType as RuntimeModelType,
    createdAt: workflowData.createdAt.toISOString(),
    updatedAt: workflowData.updatedAt.toISOString(),
    configuration: workflowData.configuration as WorkflowConfiguration,
  };
}

export async function uploadFileAndCreateExecution(
  workflowId: string,
  organizationId: string,
  userId: string,
  uploadedFile: File,
) {
  // TODO make this a transaction
  const executionId = generateId(ID_PREFIXES.workflowExecution);
  const filePath = `executions/${executionId}/${uploadedFile.name}`;
  await s3Client.file(filePath).write(await uploadedFile.arrayBuffer());
  const { id: fileId } = await createFile({
    fileName: uploadedFile.name,
    filePath: filePath,
    organizationId: organizationId,
  });
  await createWorkflowExecution({
    executionId,
    workflowId,
    fileId,
    organizationId,
    userId,
  });
  return {
    workflowExecutionId: executionId,
    workflowId,
    status: WorkflowExecutionStatus.enum.Queued,
    fileId,
    filename: uploadedFile.name,
  };
}
