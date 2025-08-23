import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { useWorkflowConfig, WorkflowConfigProvider } from "@/components/workflow/editor/workflow-config-context";
import { WorkflowObjectForm } from "@/components/workflow/editor/workflow-object-form";

function WorkflowCreatePageContent() {
  const { workflowConfig, addAnObject } = useWorkflowConfig();

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
            <Button variant="default" onClick={addAnObject}>
              Add an object
            </Button>
          </div>
        ) : (
          <>
            {workflowConfig.objects.map((object) => (
              <WorkflowObjectForm key={object.id} draftObject={object} />
            ))}
            <Button variant="default" onClick={addAnObject} className="self-start">
              <Plus className="mr-2 h-4 w-4" /> Add another object
            </Button>
          </>
        )}
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
