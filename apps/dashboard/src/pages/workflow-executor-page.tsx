import { useNavigate, useParams } from "@tanstack/react-router";
import { FileUpload } from "@/components/file-upload";
import { useWorkflowExecution } from "@/hooks/useWorkflowExecution";

export default function WorkflowExecutorPage() {
  const { workflowId } = useParams({ from: "/_app/workflows/$workflowId/execute" });
  const navigate = useNavigate();

  // const { workflow, isLoading: workflowLoading } = useWorkflow(workflowId);
  const { executeWorkflow } = useWorkflowExecution(workflowId);

  const handleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    await executeWorkflow.mutateAsync(fileArray);
  };
  //
  // if (workflowLoading) {
  //   return (
  //     <div className="w-full px-4 py-8">
  //       <div className="flex items-center justify-center">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  //         <span className="ml-2">Loading workflow...</span>
  //       </div>
  //     </div>
  //   );
  // }
  //
  // if (!workflow) {
  //   return (
  //     <div className="w-full px-4 py-8">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold mb-4">Workflow not found</h1>
  //         <Button onClick={() => navigate({ to: "/" })}>
  //           <ArrowLeft className="h-4 w-4 mr-2" />
  //           Back to Workflows
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }
  //
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
      {/* <WorkflowHeader */}
      {/*   workflowName={workflow.name} */}
      {/*   showActions={true} */}
      {/*   onBack={() => navigate({ to: "/" })} */}
      {/*   onExportResults={() => {}} */}
      {/*   onViewHistory={() => navigate({ to: `/workflows/${workflowId}/history` })} */}
      {/* /> */}
      <FileUpload onFileUpload={handleFileUpload} />
    </div>
  );
}
