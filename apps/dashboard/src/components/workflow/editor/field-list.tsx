import { Button } from "@/components/ui/button";
import { FieldForm } from "@/components/workflow/editor/field-form";
import { useWorkflowConfig } from "@/components/workflow/editor/workflow-config-context";
import type { DraftField, DraftObject } from "@/types";

interface FieldListProps {
  draftObject: DraftObject;
}

export function FieldList({ draftObject }: FieldListProps) {
  const { addField, updateField, removeField } = useWorkflowConfig();

  const handleAddField = () => {
    const newField: DraftField = {
      id: Date.now().toString(),
      name: "New Field",
      type: "string",
    };
    addField(draftObject.id, newField);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Fields</h3>
        <Button onClick={handleAddField} variant="outline" size="sm">
          Add Field
        </Button>
      </div>

      {draftObject.fields && draftObject.fields.length > 0 ? (
        <div className="space-y-3">
          {draftObject.fields.map((field) => (
            <FieldForm
              key={field.id}
              field={field}
              onChange={(updatedField) => updateField(draftObject.id, field.id, updatedField)}
              onRemove={() => removeField(draftObject.id, field.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No fields added yet</p>
      )}
    </div>
  );
}

