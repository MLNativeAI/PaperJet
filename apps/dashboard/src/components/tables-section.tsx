import type { DraftTable } from "@/types";
import { TableEditor } from "@/components/table-editor";
import { TableView } from "@/components/table-view";

interface TablesSectionProps {
  objectId: string;
  tables: DraftTable[];
  editingTableId: string | null;
  onTableEdit: (tableId: string) => void;
  onTableSave: () => void;
  onTableCancel: () => void;
  onTableRemove: (tableId: string) => void;
}

export function TablesSection({ 
  objectId, 
  tables, 
  editingTableId, 
  onTableEdit, 
  onTableSave, 
  onTableCancel, 
  onTableRemove 
}: TablesSectionProps) {
  if (!tables || tables.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Tables</h3>
      <div className="space-y-2">
        {tables.map((table) => (
          <div key={table.id}>
            {editingTableId === table.id ? (
              <TableEditor 
                objectId={objectId}
                table={table} 
                onSave={onTableSave} 
                onCancel={onTableCancel} 
              />
            ) : (
              <TableView
                table={table}
                onEdit={() => onTableEdit(table.id)}
                onRemove={() => onTableRemove(table.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}