import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useWorkflowObject } from "@/components/workflow/editor/workflow-object-context";

export function ObjectDescription() {
  const { draftObject, isEditing, updateField } = useWorkflowObject();

  return (
    <div className="space-y-2">
      <Label htmlFor={`object-description-${draftObject.id}`}>Description</Label>
      {isEditing ? (
        <Textarea
          id={`object-description-${draftObject.id}`}
          value={draftObject.description || ""}
          onChange={(e) => {
            updateField((draft) => {
              draft.description = e.target.value;
            });
          }}
          placeholder="Enter object description"
        />
      ) : (
        <div className="py-2 text-muted-foreground">{draftObject.description || "No description"}</div>
      )}
    </div>
  );
}

