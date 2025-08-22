import type { DraftField, DraftTable } from "@/types";
import { FieldEditor } from "@/components/field-editor";
import { FieldView } from "@/components/field-view";
import { TableEditor } from "@/components/table-editor";
import { TableView } from "@/components/table-view";

interface FieldsSectionProps {
  objectId: string;
  fields: DraftField[];
  editingFieldId: string | null;
  onFieldEdit: (fieldId: string) => void;
  onFieldSave: () => void;
  onFieldCancel: () => void;
  onFieldRemove: (fieldId: string) => void;
}

export function FieldsSection({ 
  objectId, 
  fields, 
  editingFieldId, 
  onFieldEdit, 
  onFieldSave, 
  onFieldCancel, 
  onFieldRemove 
}: FieldsSectionProps) {
  if (!fields || fields.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Fields</h3>
      <div className="space-y-2">
        {fields.map((field) => (
          <div key={field.id}>
            {editingFieldId === field.id ? (
              <FieldEditor 
                objectId={objectId}
                field={field} 
                onSave={onFieldSave} 
                onCancel={onFieldCancel} 
              />
            ) : (
              <FieldView
                field={field}
                onEdit={() => onFieldEdit(field.id)}
                onRemove={() => onFieldRemove(field.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}