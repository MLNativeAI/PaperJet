import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DraftField } from "@/types";
import { useWorkflowConfig } from "@/contexts/workflow-config-context";

interface FieldEditorProps {
  objectId: string;
  field: DraftField;
  onSave: () => void;
  onCancel: () => void;
}

export function FieldEditor({ objectId, field, onSave, onCancel }: FieldEditorProps) {
  const { updateField } = useWorkflowConfig();
  const [localField, setLocalField] = useState<DraftField>(field);

  const handleSave = () => {
    updateField(objectId, field.id, localField);
    onSave();
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background">
      <div className="space-y-2">
        <Label htmlFor={`field-name-${field.id}`}>Field Name</Label>
        <Input
          id={`field-name-${field.id}`}
          value={localField.name}
          onChange={(e) => setLocalField({ ...localField, name: e.target.value })}
          placeholder="Enter field name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`field-type-${field.id}`}>Field Type</Label>
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
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Field
        </Button>
      </div>
    </div>
  );
}