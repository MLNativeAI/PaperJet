import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { DraftObject } from "@/types";

interface ObjectDescriptionProps {
  object: DraftObject;
  isEditing: boolean;
  localDescription: string;
  onDescriptionChange: (description: string) => void;
}

export function ObjectDescription({ 
  object, 
  isEditing, 
  localDescription, 
  onDescriptionChange 
}: ObjectDescriptionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`object-description-${object.id}`}>Description</Label>
      {isEditing ? (
        <Textarea
          id={`object-description-${object.id}`}
          value={localDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Enter object description"
        />
      ) : (
        <div className="py-2 text-muted-foreground">{object.description || "No description"}</div>
      )}
    </div>
  );
}