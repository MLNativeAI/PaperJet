import { Button } from "@/components/ui/button";
import { FieldEditorSheet } from "@/components/workflow/editor/field-editor-sheet";
import { useWorkflowConfig } from "@/components/workflow/editor/workflow-config-context";
import { DraftObject } from "@/types";
import { Plus } from "lucide-react";

export function ObjectActions({ draftObject }: { draftObject: DraftObject }) {
  const { addField } = useWorkflowConfig();

  return (
    <div className="flex justify-between gap-2">
      <div className="flex gap-2">
        <FieldEditorSheet
          objectId={draftObject.id}
          mode="add"
          trigger={
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          }
        />
      </div>
    </div>
  );
}
