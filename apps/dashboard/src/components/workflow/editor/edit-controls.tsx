import { Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditControlsProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

export function EditControls({ isEditing, onSave, onCancel, onEdit }: EditControlsProps) {
  return (
    <div className="flex gap-2 justify-end">
      {isEditing ? (
        <>
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </>
      ) : (
        <Button variant="outline" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      )}
    </div>
  );
}