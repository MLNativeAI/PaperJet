import type { WorkflowExecutionStatus } from "../types";

export type WorkflowExecutionRow = {
  status: WorkflowExecutionStatus;
  id: string;
  createdAt: string;
  ownerId: string;
  workflowId: string;
  workflowName: string;
  fileId: string;
  fileName: string;
  jobId: string | null;
  errorMessage: string | null;
  startedAt: string;
  completedAt: string | null;
};

export type WorkflowExecutionData = {
  status: WorkflowExecutionStatus;
  id: string;
  createdAt: string;
  ownerId: string;
  workflowId: string;
  workflowName: string;
  fileId: string;
  fileName: string;
  jobId: string | null;
  errorMessage: string | null;
  startedAt: string;
  completedAt: string | null;
  extractedData: any;
};
