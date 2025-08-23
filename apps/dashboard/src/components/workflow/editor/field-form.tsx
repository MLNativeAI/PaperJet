import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DraftField } from "@/types";
import { Trash2 } from "lucide-react";

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
    <div className="py-3 space-y-3">
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <Label htmlFor={`field-name-${field.id}`} className="w-24">
            Name
          </Label>
          <Input
            id={`field-name-${field.id}`}
            value={field.name}
            onChange={handleNameChange}
            placeholder="Field name"
            className="flex-1"
          />
        </div>

        <div className="flex items-start gap-4">
          <Label htmlFor={`field-description-${field.id}`} className="w-24 pt-2">
            Description
          </Label>
          <Textarea
            id={`field-description-${field.id}`}
            value={field.description || ""}
            onChange={handleDescriptionChange}
            placeholder="Field description (optional)"
            className="flex-1 min-h-[40px] h-10 resize-none"
          />
        </div>

        <div className="flex justify-between">
          {" "}
          <div className="flex items-center gap-4">
            <Label htmlFor={`field-type-${field.id}`} className="w-24">
              Type
            </Label>
            <div className="flex-1">
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
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive"
          >
            Remove Field
            <Trash2 className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

