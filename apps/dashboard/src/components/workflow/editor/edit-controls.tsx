import { Edit, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkflowObject } from "@/components/workflow/editor/workflow-object-context";

export function EditControls() {
  const { isEditing, cancelEditing, finishEditing, startEditing } = useWorkflowObject();
  return (
    <div className="">
      {isEditing ? (
        <div className="flex gap-2 justify-between">
          <div>
            <Button variant="outline">
              <Plus />
              Add field
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={cancelEditing}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={finishEditing}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" onClick={startEditing}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      )}
    </div>
  );
}

