import type { ApiRoutes } from "@api/index";
import type { WorkflowExecutionData, WorkflowExecutionRow } from "@paperjet/engine/types";
import { hc, type InferResponseType } from "hono/client";

const apiClient = hc<ApiRoutes>("/");

export type ExecutionList = InferResponseType<typeof apiClient.api.v1.executions.$get>;

export const getAllExecutions = async (): Promise<WorkflowExecutionRow[]> => {
  const response = await apiClient.api.v1.executions.$get();
  if (!response.ok) {
    throw new Error("Failed to fetch executions");
  }

  const data = await response.json();
  return data;
};

export const getExecutionById = async (executionId: string): Promise<WorkflowExecutionData> => {
  const response = await apiClient.api.v1.executions[":executionId"].$get({
    param: { executionId },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch execution");
  }
  return response.json();
};
