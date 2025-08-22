import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DraftTable } from "@/types";
import { useWorkflowConfig } from "@/contexts/workflow-config-context";

interface TableEditorProps {
  objectId: string;
  table: DraftTable;
  onSave: () => void;
  onCancel: () => void;
}

export function TableEditor({ objectId, table, onSave, onCancel }: TableEditorProps) {
  const { updateTable } = useWorkflowConfig();
  const [localTable, setLocalTable] = useState<DraftTable>(table);

  const handleSave = () => {
    updateTable(objectId, table.id, localTable);
    onSave();
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background">
      <div className="space-y-2">
        <Label htmlFor={`table-name-${table.id}`}>Table Name</Label>
        <Input
          id={`table-name-${table.id}`}
          value={localTable.name}
          onChange={(e) => setLocalTable({ ...localTable, name: e.target.value })}
          placeholder="Enter table name"
        />
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Table
        </Button>
      </div>
    </div>
  );
}