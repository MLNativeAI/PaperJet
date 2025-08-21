import type { WorkflowRoutes } from "@paperjet/api/routes";
import { useMutation } from "@tanstack/react-query";
import { hc } from "hono/client";
import { toast } from "sonner";

const _workflowClient = hc<WorkflowRoutes>("/api/v1/workflows");

export function useWorkflowExecution(workflowId: string) {
  const executeWorkflow = useMutation({
    mutationFn: async (files: File[]) => {
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
    },
    onSuccess: () => {
      toast.success("Workflow execution completed!");
    },
    onError: (error) => {
      toast.error("Failed to execute workflow");
      console.error("Execution error:", error);
    },
  });

  return {
    executeWorkflow,
  };
}
