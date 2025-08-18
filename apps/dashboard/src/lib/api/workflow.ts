import type { ApiRoutes } from "@api/index";
import { hc, type InferResponseType } from "hono/client";

const apiClient = hc<ApiRoutes>("/");

const bulkExecute = apiClient.api.v1.workflows[":workflowId"]["execute-bulk"].$post;

export type BulkExecuteResponse = InferResponseType<typeof bulkExecute>;

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
