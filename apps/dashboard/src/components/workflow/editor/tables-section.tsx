import type { DraftTable } from "@/types";
import { TableView } from "@/components/workflow/editor/table-view";

interface TablesSectionProps {
  objectId: string;
  tables: DraftTable[];
  isEditing: boolean;
  onTableUpdate: (updatedTable: DraftTable) => void;
  onTableRemove: (tableId: string) => void;
  onAddTable: () => void;
}

export function TablesSection({ 
  objectId, 
  tables, 
  isEditing, 
  onTableUpdate, 
  onTableRemove,
  onAddTable
}: TablesSectionProps) {
  if (!tables || tables.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Tables</h3>
        {isEditing && (
          <button 
            onClick={onAddTable}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Table
          </button>
        )}
      </div>
      <div className="space-y-2">
        {tables.map((table) => (
          <TableView
            key={table.id}
            table={table}
            isEditing={isEditing}
            onUpdate={onTableUpdate}
            onRemove={() => onTableRemove(table.id)}
          />
        ))}
      </div>
    </div>
  );
}

