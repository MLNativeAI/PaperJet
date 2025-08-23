import { Button } from "@/components/ui/button";
import { useWorkflowConfig } from "@/components/workflow/editor/workflow-config-context";
import { DraftObject } from "@/types";
import { Plus } from "lucide-react";

export function ObjectActions({ draftObject }: { draftObject: DraftObject }) {
  const { addField, addTable } = useWorkflowConfig();

  return (
    <div className="flex justify-between gap-2">
      <div className="flex gap-2">
        <Button onClick={() => addField(draftObject.id)} variant="outline" size="sm">
          <Plus className="h-4 w-4" />
          Add Field
        </Button>
        <Button onClick={() => addTable(draftObject.id)} variant="outline" size="sm">
          <Plus className="h-4 w-4" />
          Add Table
        </Button>
      </div>
    </div>
  );
}
