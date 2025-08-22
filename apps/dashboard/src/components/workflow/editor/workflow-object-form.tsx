import { EditControls } from "@/components/workflow/editor/edit-controls";
import { ObjectDescription } from "@/components/workflow/editor/object-description";
import { ObjectHeader } from "@/components/workflow/editor/object-header";
import { WorkflowObjectProvider } from "@/components/workflow/editor/workflow-object-context";
import type { DraftObject } from "@/types";

function WorkflowObjectFormContent() {
  return (
    <div className="p-4 border rounded-lg space-y-4">
      <ObjectHeader />
      <ObjectDescription />
      <EditControls />
    </div>
  );
}

export function WorkflowObjectForm({ initialObject }: { initialObject: DraftObject }) {
  return (
    <WorkflowObjectProvider initialObject={initialObject}>
      <WorkflowObjectFormContent />
    </WorkflowObjectProvider>
  );
}
