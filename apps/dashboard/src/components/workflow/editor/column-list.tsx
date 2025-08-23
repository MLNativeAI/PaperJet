import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkflowConfig } from "@/components/workflow/editor/workflow-config-context";
import type { DraftObject, DraftTable, DraftColumn } from "@/types";
import { ColumnForm } from "@/components/workflow/editor/column-form";
import { Plus } from "lucide-react";

interface ColumnListProps {
  draftObject: DraftObject;
  draftTable: DraftTable;
}

export function ColumnList({ draftObject, draftTable }: ColumnListProps) {
  const { updateObject } = useWorkflowConfig();

  const handleAddColumn = () => {
    const updatedTables = (draftObject.tables || []).map((table) => {
      if (table.id === draftTable.id) {
        return {
          ...table,
          columns: [
            ...(table.columns || []),
            {
              id: Date.now().toString(),
              name: "",
              type: "string",
            },
          ],
        };
      }
      return table;
    });

    updateObject({
      ...draftObject,
      tables: updatedTables,
    });
  };

  const handleUpdateColumn = (updatedColumn: DraftColumn) => {
    const updatedTables = (draftObject.tables || []).map((table) => {
      if (table.id === draftTable.id) {
        const updatedColumns = (table.columns || []).map((column) =>
          column.id === updatedColumn.id ? updatedColumn : column
        );
        return {
          ...table,
          columns: updatedColumns,
        };
      }
      return table;
    });

    updateObject({
      ...draftObject,
      tables: updatedTables,
    });
  };

  const handleRemoveColumn = (columnId: string) => {
    const updatedTables = (draftObject.tables || []).map((table) => {
      if (table.id === draftTable.id) {
        const updatedColumns = (table.columns || []).filter(
          (column) => column.id !== columnId
        );
        return {
          ...table,
          columns: updatedColumns,
        };
      }
      return table;
    });

    updateObject({
      ...draftObject,
      tables: updatedTables,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Columns</h4>
        <Button onClick={handleAddColumn} size="sm" variant="outline">
          <Plus className="h-3 w-3 mr-2" />
          Add Column
        </Button>
      </div>

      {draftTable.columns && draftTable.columns.length > 0 ? (
        <div className="grid gap-2">
          {draftTable.columns.map((column) => (
            <ColumnForm
              key={column.id}
              draftObject={draftObject}
              draftTable={draftTable}
              draftColumn={column}
              onUpdateColumn={handleUpdateColumn}
              onRemoveColumn={handleRemoveColumn}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-4 text-center text-sm text-muted-foreground">
            No columns added yet. Click "Add Column" to create one.
          </CardContent>
        </Card>
      )}
    </div>
  );
}