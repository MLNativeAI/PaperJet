import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";
import { ExecutionStatusBadge } from "@/components/execution-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getExecutionById } from "@/lib/api/executions";
import { formatDuration } from "@/lib/utils/date";

function exportResults() {
  toast.info("Export functionality coming soon");
}
export default function ExecutionPage() {
  const { executionId } = useParams({ from: "/_app/executions/$executionId" });
  const navigate = useNavigate();

  const {
    data: execution,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["execution", executionId],
    queryFn: () => getExecutionById(executionId),
  });

  if (isLoading) {
    return <div className="w-full px-4 py-8">Loading execution...</div>;
  }

  if (error) {
    return <div className="w-full px-4 py-8">Error loading execution: {error.message}</div>;
  }

  if (!execution) {
    return <div className="w-full px-4 py-8">Execution not found</div>;
  }

  return (
    <div className="w-full px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate({ to: "/executions" })} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Executions
          </Button>
          <h1 className="text-3xl font-bold">Execution Details</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-muted-foreground">{execution.workflowName}</span>
            <ExecutionStatusBadge status={execution.status} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {execution.status === "Completed" && execution.extractedData && (
            <Button onClick={exportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>File Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Filename</p>
              <p className="text-lg font-medium">{execution.fileName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <ExecutionStatusBadge status={execution.status} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Duration</p>
              <p className="text-lg">{formatDuration(execution.startedAt, execution.completedAt)}</p>
            </div>
            {execution.errorMessage && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Error Message</p>
                <p className="text-sm text-red-600">{execution.errorMessage}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
