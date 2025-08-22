import type { DraftField } from "@/types";
import { FieldView } from "@/components/workflow/editor/field-view";

interface FieldsSectionProps {
  objectId: string;
  fields: DraftField[];
  isEditing: boolean;
  onFieldUpdate: (updatedField: DraftField) => void;
  onFieldRemove: (fieldId: string) => void;
  onAddField: () => void;
}

export function FieldsSection({ 
  objectId, 
  fields, 
  isEditing, 
  onFieldUpdate, 
  onFieldRemove,
  onAddField
}: FieldsSectionProps) {
  if (!fields || fields.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Fields</h3>
        {isEditing && (
          <button 
            onClick={onAddField}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Field
          </button>
        )}
      </div>
      <div className="space-y-2">
        {fields.map((field) => (
          <FieldView
            key={field.id}
            field={field}
            isEditing={isEditing}
            onUpdate={onFieldUpdate}
            onRemove={() => onFieldRemove(field.id)}
          />
        ))}
      </div>
    </div>
  );
}

