import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWorkflowConfig } from "@/components/workflow/editor/workflow-config-context";
import type { DraftObject } from "@/types";

export function ObjectHeader({ draftObject }: { draftObject: DraftObject }) {
  const { updateObject } = useWorkflowConfig();
  return (
    <div className="py-3 space-y-3">
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <Label htmlFor={`object-name-${draftObject.id}`} className="w-24">
            Name
          </Label>
          <Input
            id={`object-name-${draftObject.id}`}
            value={draftObject.name}
            onChange={(e) => {
              updateObject({ ...draftObject, name: e.target.value });
            }}
            placeholder="Enter object name"
            className="flex-1"
          />
        </div>

        <div className="flex items-start gap-4">
          <Label htmlFor={`object-description-${draftObject.id}`} className="w-24 pt-2">
            Description
          </Label>
          <Textarea
            id={`object-description-${draftObject.id}`}
            value={draftObject.description || ""}
            onChange={(e) => {
              updateObject({ ...draftObject, description: e.target.value });
            }}
            placeholder="Enter object description"
            className="flex-1 min-h-[40px] h-10 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
