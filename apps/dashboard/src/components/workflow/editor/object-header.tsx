import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DraftObject } from "@/types";

interface ObjectHeaderProps {
  object: DraftObject;
  isEditing: boolean;
  localName: string;
  onNameChange: (name: string) => void;
  onRemove: () => void;
}

export function ObjectHeader({ 
  object, 
  isEditing, 
  localName, 
  onNameChange, 
  onRemove 
}: ObjectHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1 pr-2">
        <Label htmlFor={`object-name-${object.id}`}>Object Name</Label>
        {isEditing ? (
          <Input
            id={`object-name-${object.id}`}
            value={localName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter object name"
          />
        ) : (
          <div className="py-2 font-medium">{object.name}</div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}