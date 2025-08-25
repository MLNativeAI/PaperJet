import { getFieldIconByType } from "@/components/utils";
import type { DraftObject } from "@/types";

interface FieldListProps {
  draftObject: DraftObject;
}

export function FieldList({ draftObject }: FieldListProps) {
  // const { updateField, removeField } = useWorkflowConfig();

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
              <div className="flex flex-col space-y-1 p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                    {getFieldIconByType(field.type)}
                    {field.name}
                  </span>
                </div>
                <div className="text-sm font-medium">{field.description}</div>
              </div>
            </>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No fields added yet</p>
      )}
    </div>
  );
}
