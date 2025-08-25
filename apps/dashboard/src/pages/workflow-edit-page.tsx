import type { Workflow } from "@paperjet/engine/types";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { AddObjectButton } from "@/components/workflow/editor/add-object-button";
import { useWorkflowConfig, WorkflowConfigProvider } from "@/components/workflow/editor/workflow-config-context";
import { WorkflowObjectForm } from "@/components/workflow/editor/workflow-object-form";

interface WorkflowEditPageProps {
  workflow: Workflow;
}

function WorkflowEditPageContent() {
  const { workflowConfig } = useWorkflowConfig();
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      // This would be the save implementation
      // For now, we'll just show a toast
      toast.success("Workflow saved successfully");
      navigate({ to: "/" });
    } catch (error) {
      toast.error("Failed to save workflow");
      console.error("Error saving workflow:", error);
    }
  };

  return (
    <div className="w-full px-4 py-8 space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Edit the objects, fields and tables for your document processing workflow.
          </p>
        </div>
      </div>
      <div>
        <CardTitle>Workflow configuration</CardTitle>
        <CardDescription>
          Here you can define objects, fields and tables that will be extracted from your files.
        </CardDescription>
      </div>
      <div className="flex flex-col gap-6">
        {workflowConfig.objects.length === 0 ? (
          <div className="flex flex-col gap-4 items-center text-center py-8">
            <span>You don't have any data defined yet</span>
            <AddObjectButton />
          </div>
        ) : (
          <>
            {workflowConfig.objects.map((object) => (
              <WorkflowObjectForm key={object.id} draftObject={object} />
            ))}
            <AddObjectButton />
          </>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate({ to: "/" })}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}

export default function WorkflowEditPage({ workflow }: WorkflowEditPageProps) {
  return (
    <WorkflowConfigProvider initialWorkflow={workflow}>
      <WorkflowEditPageContent />
    </WorkflowConfigProvider>
  );
}

