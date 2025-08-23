import { Button } from "@/components/ui/button";
import { useWorkflowConfig } from "@/components/workflow/editor/workflow-config-context";
import { DraftObject } from "@/types";
import { Plus, Trash2 } from "lucide-react";

export function ObjectActions({ draftObject }: { draftObject: DraftObject }) {
  const { addField, addTable, removeObject } = useWorkflowConfig();

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
      <Button
        variant="outline"
        size="sm"
        onClick={() => removeObject(draftObject.id)}
        className="text-muted-foreground hover:text-destructive"
      >
        Delete object
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
