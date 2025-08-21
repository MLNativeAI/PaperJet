import type { WorkflowRoutes } from "@paperjet/api/routes";
import { hc } from "hono/client";

const workflowClient = hc<WorkflowRoutes>("/api/v1/workflows");

export async function getAllWorkflows() {
  const response = await workflowClient.index.$get({});

  if (!response.ok) {
    throw new Error("Failed to fetch workflow");
  }

  return response.json();
}

export const executeWorkflowBulk = async (workflowId: string, files: File[]): Promise<any> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const executeBulkResponse = await fetch(`/api/v1/workflows/${workflowId}/execute-bulk`, {
    method: "POST",
    body: formData,
  });

  if (!executeBulkResponse.ok) {
    throw new Error(`HTTP error! status: ${executeBulkResponse.status}`);
  }

  return executeBulkResponse.json();
};

export const getWorkflow = async (workflowId: string) => {
  const response = await workflowClient[":workflowId"].$get({
    param: { id: workflowId },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch workflow");
  }

  return response.json();
};
export const deleteWorkflowMutation = async (workflowId: string) => {
  const response = await workflowClient[":workflowId"].$delete({
    param: { workflowId: workflowId },
  });

  if (!response.ok) {
    throw new Error("Failed to delete workflow");
  }

  return response.json();
};

export const createWorkflowFromFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/workflows", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to create workflow from file");
  }

  return response.json();
};
