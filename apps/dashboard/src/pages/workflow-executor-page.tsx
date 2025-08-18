import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { useWorkflowExecution } from "@/hooks/useWorkflowExecution";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

interface ExecutionResult {
  workflowExecutionId: string;
  workflowId: string;
  fileName: string;
  fileId: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt?: string;
}

export default function WorkflowExecutorPage() {
  const { workflowId } = useParams({ from: "/_app/workflows/$workflowId/execute" });
  const navigate = useNavigate();
  const [executions, setExecutions] = useState<ExecutionResult[]>([]);

  const { executeWorkflow } = useWorkflowExecution(workflowId);

  const getStatusIcon = (status: ExecutionResult["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "processing":
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: ExecutionResult["status"]) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "processing":
        return "Processing";
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  };

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
          status: "pending",
          createdAt: new Date().toISOString(),
        }));
        setExecutions((prev) => [...newExecutions, ...prev]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="w-full px-4 py-8 space-y-8">
      {/* Header */}
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
              <Card key={execution.workflowExecutionId} className="w-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {execution.fileName}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(execution.status)}
                      <span className="text-sm font-medium">{getStatusText(execution.status)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Execution ID: {execution.workflowExecutionId}</span>
                    {execution.createdAt && <span>Started: {new Date(execution.createdAt).toLocaleTimeString()}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
