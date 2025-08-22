import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkflowObject } from "@/components/workflow/editor/workflow-object-context";

export function ObjectHeader() {
  const { draftObject, isEditing, updateField, deleteObject } = useWorkflowObject();

  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1 pr-2">
        <Label htmlFor={`object-name-${draftObject.id}`}>Object Name</Label>
        {isEditing ? (
          <Input
            id={`object-name-${draftObject.id}`}
            value={draftObject.name}
            onChange={(e) => {
              updateField((draft) => {
                draft.name = e.target.value;
              });
            }}
            placeholder="Enter object name"
          />
        ) : (
          <div className="py-2 font-medium">{draftObject.name}</div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={deleteObject}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
