import { ObjectDescription } from "@/components/workflow/editor/object-description";
import { ObjectHeader } from "@/components/workflow/editor/object-header";
import { FieldForm } from "@/components/workflow/editor/field-form";
import { Button } from "@/components/ui/button";
import { useWorkflowConfig } from "@/components/workflow/editor/workflow-config-context";
import type { DraftObject, DraftField } from "@/types";

export function WorkflowObjectForm({ draftObject }: { draftObject: DraftObject }) {
  const { updateField, addField } = useWorkflowConfig();

  const handleFieldChange = (fieldId: string, updatedField: DraftField) => {
    updateField(draftObject.id, (draft) => {
      if (draft.fields) {
        const fieldIndex = draft.fields.findIndex(f => f.id === fieldId);
        if (fieldIndex !== -1) {
          draft.fields[fieldIndex] = updatedField;
        }
      }
    });
  };

  const handleAddField = () => {
    const newField: DraftField = {
      id: Date.now().toString(),
      name: "New Field",
      type: "string"
    };
    addField(draftObject.id, newField);
  };

  const handleRemoveField = (fieldId: string) => {
    updateField(draftObject.id, (draft) => {
      if (draft.fields) {
        const fieldIndex = draft.fields.findIndex(f => f.id === fieldId);
        if (fieldIndex !== -1) {
          draft.fields.splice(fieldIndex, 1);
        }
      }
    });
  };

  return (
    <div className="p-4 border rounded-lg space-y-6">
      <ObjectHeader draftObject={draftObject} />
      <ObjectDescription draftObject={draftObject} />
      
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
                onChange={(updatedField) => handleFieldChange(field.id, updatedField)}
                onRemove={() => handleRemoveField(field.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No fields added yet</p>
        )}
      </div>
    </div>
  );
}
