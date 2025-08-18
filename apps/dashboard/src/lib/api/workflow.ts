import type { ApiRoutes } from "@api/index";
import { hc, type InferResponseType } from "hono/client";

const apiClient = hc<ApiRoutes>("/");

const bulkExecute = apiClient.api.v1.workflows[":workflowId"]["execute-bulk"].$post;

export type BulkExecuteResponse = InferResponseType<typeof bulkExecute>;
export const executeWorkflowBulk = async (workflowId: string, files: File[]): Promise<BulkExecuteResponse> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const executeBulkResponse = await bulkExecute({
    param: { workflowId },
    form: {
      files: files,
    },
  });
  const body = executeBulkResponse.json();
  return body;
};
