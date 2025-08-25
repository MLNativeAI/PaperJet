import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useWorkflowConfig, WorkflowConfigProvider } from "@/components/workflow/editor/workflow-config-context";
import { WorkflowObjectForm } from "@/components/workflow/editor/workflow-object-form";
import { AddObjectButton } from "@/components/workflow/editor/add-object-button";

function WorkflowCreatePageContent() {
  const { workflowConfig, name, description, setName, setDescription, createWorkflow } = useWorkflowConfig();
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      await createWorkflow.mutateAsync();
      toast.success("Workflow created successfully");
      navigate({ to: "/" });
    } catch (error) {
      toast.error("Failed to create workflow");
      console.error("Error creating workflow:", error);
    }
  };

  return (
    <div className="w-full px-4 py-8 space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create new Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Define the objects, fields and tables that you would like to have extracted from your documents.
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="workflow-name">Workflow Name</Label>
          <Input
            id="workflow-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter workflow name"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="workflow-description">Description</Label>
          <Textarea
            id="workflow-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter workflow description"
            className="mt-1"
          />
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
        <Button onClick={handleSave} disabled={createWorkflow.isPending}>
          {createWorkflow.isPending ? "Creating..." : "Create Workflow"}
        </Button>
      </div>
    </div>
  );
}

export default function WorkflowCreatePage() {
  return (
    <WorkflowConfigProvider>
      <WorkflowCreatePageContent />
    </WorkflowConfigProvider>
  );
}
