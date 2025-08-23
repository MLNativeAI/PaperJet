import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkflowConfig } from "@/components/workflow/editor/workflow-config-context";
import type { DraftObject } from "@/types";

export function ObjectHeader({ draftObject }: { draftObject: DraftObject }) {
  const { updateField, removeObject } = useWorkflowConfig();
  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1 pr-2">
        <Label htmlFor={`object-name-${draftObject.id}`}>Object Name</Label>
        <Input
          id={`object-name-${draftObject.id}`}
          value={draftObject.name}
          onChange={(e) => {
            updateField(draftObject.id, (draft) => {
              draft.name = e.target.value;
            });
          }}
          placeholder="Enter object name"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeObject(draftObject.id)}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
