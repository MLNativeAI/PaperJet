import type { WorkflowExecutionStatus } from "@paperjet/engine/types";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import ExecutionStatusRow from "@/components/workflow/execution/execution-status-row";
import { useWorkflowExecution } from "@/hooks/use-workflow-execution";

export interface ExecutionResult {
  workflowExecutionId: string;
  workflowId: string;
  fileName: string;
  fileId: string;
  createdAt?: string;
  status: WorkflowExecutionStatus;
}

export default function WorkflowExecutorPage() {
  const { workflowId } = useParams({ from: "/_app/workflows/$workflowId/execute" });
  const [executions, setExecutions] = useState<ExecutionResult[]>([]);

  const { executeWorkflow } = useWorkflowExecution(workflowId);
  const handleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    try {
      const result = await executeWorkflow.mutateAsync(fileArray);

      // Add executions to local state
      if (result?.executions) {
        const newExecutions: ExecutionResult[] = result.executions.map((execution: any, index: number) => ({
          workflowExecutionId: execution.workflowExecutionId,
          workflowId: execution.workflowId,
          fileName: fileArray[index]?.name || `File ${index + 1}`,
          fileId: execution.fileId,
          createdAt: new Date().toISOString(),
          status: execution.status,
        }));
        setExecutions((prev) => [...newExecutions, ...prev]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="w-full px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Execute workflow</h1>
          <p className="text-muted-foreground mt-2">
            Upload documents to process with this workflow. Supports PDFs files only.
          </p>
        </div>
      </div>
      <FileUpload onFileUpload={handleFileUpload} />
      {executions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Processing Status</h2>
          <div className="grid gap-4">
            {executions.map((execution) => (
              <ExecutionStatusRow key={execution.workflowExecutionId} execution={execution} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
