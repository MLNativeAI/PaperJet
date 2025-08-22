import { useState } from "react";
import { Minus, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DraftTable } from "@/types";

interface TableViewProps {
  table: DraftTable;
  isEditing: boolean;
  onUpdate: (updatedTable: DraftTable) => void;
  onRemove: () => void;
}

export function TableView({ table, isEditing, onUpdate, onRemove }: TableViewProps) {
  const [isEditingTable, setIsEditingTable] = useState(false);
  const [localTable, setLocalTable] = useState<DraftTable>(table);

  const handleEdit = () => {
    setLocalTable(table);
    setIsEditingTable(true);
  };

  const handleSave = () => {
    onUpdate(localTable);
    setIsEditingTable(false);
  };

  const handleCancel = () => {
    setLocalTable(table);
    setIsEditingTable(false);
  };

  if (isEditingTable) {
    return (
      <div className="p-4 border rounded-lg bg-background space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Edit Table</h4>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <label htmlFor={`table-name-${table.id}`} className="text-sm font-medium">
            Table Name
          </label>
          <Input
            id={`table-name-${table.id}`}
            value={localTable.name}
            onChange={(e) => setLocalTable({ ...localTable, name: e.target.value })}
            placeholder="Enter table name"
          />
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-2 bg-muted rounded">
      <div>
        <span className="font-medium">{table.name}</span>
      </div>
      {isEditing && (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="text-muted-foreground hover:text-foreground"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}