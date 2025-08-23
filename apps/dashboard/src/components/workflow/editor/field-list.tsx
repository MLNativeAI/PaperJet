import { Separator } from "@/components/ui/separator";
import { FieldForm } from "@/components/workflow/editor/field-form";
import { useWorkflowConfig } from "@/components/workflow/editor/workflow-config-context";
import type { DraftObject } from "@/types";

interface FieldListProps {
  draftObject: DraftObject;
}

export function FieldList({ draftObject }: FieldListProps) {
  const { updateField, removeField } = useWorkflowConfig();

  if (!draftObject.fields || draftObject.fields.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Fields</h3>
      </div>

      {draftObject.fields && draftObject.fields.length > 0 ? (
        <div className="space-y-3">
          {draftObject.fields.map((field, index) => (
            <>
              <FieldForm
                key={field.id}
                field={field}
                onChange={(updatedField) => updateField(draftObject.id, field.id, updatedField)}
                onRemove={() => removeField(draftObject.id, field.id)}
              />
              {draftObject.fields && index < draftObject.fields.length - 1 && <Separator />}
            </>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No fields added yet</p>
      )}
    </div>
  );
}
