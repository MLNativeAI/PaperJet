import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWorkflowConfig } from "@/components/workflow/editor/workflow-config-context";
import type { DraftObject } from "@/types";

export function ObjectDescription({ draftObject }: { draftObject: DraftObject }) {
  const { updateObject } = useWorkflowConfig();

  return (
    <div className="space-y-2">
      <Label htmlFor={`object-description-${draftObject.id}`}>Description</Label>
      <Textarea
        id={`object-description-${draftObject.id}`}
        value={draftObject.description || ""}
        onChange={(e) => {
          updateObject({ ...draftObject, description: e.target.value });
        }}
        placeholder="Enter object description"
      />
    </div>
  );
}
