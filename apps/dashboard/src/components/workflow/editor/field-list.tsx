import { getFieldIconByType } from "@/components/utils";
import type { DraftObject, DraftTable } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { ColumnList } from "./column-list";

interface FieldListProps {
  draftObject: DraftObject;
}

export function FieldList({ draftObject }: FieldListProps) {
  // const { updateField, removeField } = useWorkflowConfig();

  const hasFields = draftObject.fields && draftObject.fields.length > 0;
  const hasTables = draftObject.tables && draftObject.tables.length > 0;

  if (!hasFields && !hasTables) {
    return null;
  }

  return (
    <div className="space-y-6">
      {hasFields && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Fields</h3>
          </div>

          {draftObject.fields && draftObject.fields.length > 0 ? (
            <div className="space-y-3">
              {draftObject.fields.map((field) => (
                <div key={field.id} className="flex flex-col space-y-1 p-3 bg-muted/30 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      {getFieldIconByType(field.type)}
                      {field.name}
                    </span>
                  </div>
                  <div className="text-sm font-medium">{field.description}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No fields added yet</p>
          )}
        </div>
      )}

      {hasTables && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Tables</h3>
          </div>

          <div className="space-y-4">
            {draftObject.tables?.map((table: DraftTable) => (
              <Card key={table.id}>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium">{table.name || "Unnamed Table"}</h4>
                    <p className="text-sm text-muted-foreground">{table.description}</p>
                  </div>
                  <ColumnList draftObject={draftObject} draftTable={table} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
