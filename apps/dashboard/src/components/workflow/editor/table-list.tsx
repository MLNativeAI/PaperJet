import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkflowConfig } from "@/components/workflow/editor/workflow-config-context";
import type { DraftObject, DraftTable } from "@/types";
import { TableForm } from "@/components/workflow/editor/table-form";
import { Plus } from "lucide-react";

interface TableListProps {
  draftObject: DraftObject;
}

export function TableList({ draftObject }: TableListProps) {
  const { addTable, updateObject } = useWorkflowConfig();
  
  const handleAddTable = () => {
    addTable(draftObject.id);
  };

  const handleUpdateTable = (updatedTable: DraftTable) => {
    const updatedTables = draftObject.tables?.map((table) =>
      table.id === updatedTable.id ? updatedTable : table
    ) || [];
    
    updateObject({
      ...draftObject,
      tables: updatedTables,
    });
  };

  const handleRemoveTable = (tableId: string) => {
    const updatedTables = draftObject.tables?.filter((table) => table.id !== tableId) || [];
    updateObject({
      ...draftObject,
      tables: updatedTables,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tables</h3>
        <Button onClick={handleAddTable} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Table
        </Button>
      </div>
      
      {draftObject.tables && draftObject.tables.length > 0 ? (
        <div className="grid gap-4">
          {draftObject.tables.map((table) => (
            <TableForm
              key={table.id}
              draftObject={draftObject}
              draftTable={table}
              onUpdateTable={handleUpdateTable}
              onRemoveTable={handleRemoveTable}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No tables added yet. Click "Add Table" to create one.
          </CardContent>
        </Card>
      )}
    </div>
  );
}