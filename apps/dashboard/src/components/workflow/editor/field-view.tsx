import { useState } from "react";
import { Minus, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DraftField } from "@/types";

interface FieldViewProps {
  field: DraftField;
  isEditing: boolean;
  onUpdate: (updatedField: DraftField) => void;
  onRemove: () => void;
}

export function FieldView({ field, isEditing, onUpdate, onRemove }: FieldViewProps) {
  const [isEditingField, setIsEditingField] = useState(false);
  const [localField, setLocalField] = useState<DraftField>(field);

  const handleEdit = () => {
    setLocalField(field);
    setIsEditingField(true);
  };

  const handleSave = () => {
    onUpdate(localField);
    setIsEditingField(false);
  };

  const handleCancel = () => {
    setLocalField(field);
    setIsEditingField(false);
  };

  if (isEditingField) {
    return (
      <div className="p-4 border rounded-lg bg-background space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Edit Field</h4>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <label htmlFor={`field-name-${field.id}`} className="text-sm font-medium">
            Field Name
          </label>
          <Input
            id={`field-name-${field.id}`}
            value={localField.name}
            onChange={(e) => setLocalField({ ...localField, name: e.target.value })}
            placeholder="Enter field name"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor={`field-type-${field.id}`} className="text-sm font-medium">
            Field Type
          </label>
          <Select
            value={localField.type}
            onValueChange={(value: "string" | "date" | "number") => 
              setLocalField({ ...localField, type: value })
            }
          >
            <SelectTrigger id={`field-type-${field.id}`}>
              <SelectValue placeholder="Select field type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="number">Number</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-2 bg-muted rounded">
      <div>
        <span className="font-medium">{field.name}</span>
        <span className="text-sm text-muted-foreground ml-2">({field.type})</span>
      </div>
      {isEditing && (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="text-muted-foreground hover:text-foreground"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}