import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ObjectActionsProps {
  isEditing: boolean;
  onAddField: () => void;
  onAddTable: () => void;
}

export function ObjectActions({ isEditing, onAddField, onAddTable }: ObjectActionsProps) {
  if (!isEditing) return null;

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onAddField}>
        <Plus className="mr-2 h-4 w-4" />
        Add Field
      </Button>
      <Button variant="outline" onClick={onAddTable}>
        <Plus className="mr-2 h-4 w-4" />
        Add Table
      </Button>
    </div>
  );
}