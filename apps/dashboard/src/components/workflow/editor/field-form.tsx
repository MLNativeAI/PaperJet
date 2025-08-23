import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DraftField } from "@/types";

interface FieldFormProps {
  field: DraftField;
  onChange: (field: DraftField) => void;
  onRemove: () => void;
}

export function FieldForm({ field, onChange, onRemove }: FieldFormProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...field, name: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...field, description: e.target.value });
  };

  const handleTypeChange = (value: string) => {
    onChange({ ...field, type: value as "string" | "date" | "number" });
  };

  return (
    <div className="p-3 border rounded-md space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Field Details</h4>
        <button
          type="button"
          onClick={onRemove}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Remove Field
        </button>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`field-name-${field.id}`}>Name</Label>
        <Input
          id={`field-name-${field.id}`}
          value={field.name}
          onChange={handleNameChange}
          placeholder="Field name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`field-description-${field.id}`}>Description</Label>
        <Textarea
          id={`field-description-${field.id}`}
          value={field.description || ""}
          onChange={handleDescriptionChange}
          placeholder="Field description (optional)"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`field-type-${field.id}`}>Type</Label>
        <Select value={field.type} onValueChange={handleTypeChange}>
          <SelectTrigger id={`field-type-${field.id}`}>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="number">Number</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}