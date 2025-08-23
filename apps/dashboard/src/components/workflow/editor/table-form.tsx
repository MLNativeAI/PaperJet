import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ColumnList } from "@/components/workflow/editor/column-list";
import type { DraftObject, DraftTable } from "@/types";
import { Trash2 } from "lucide-react";

interface TableFormProps {
  draftObject: DraftObject;
  draftTable: DraftTable;
  onUpdateTable: (updatedTable: DraftTable) => void;
  onRemoveTable: (tableId: string) => void;
}

export function TableForm({
  draftObject,
  draftTable,
  onUpdateTable,
  onRemoveTable,
}: TableFormProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateTable({
      ...draftTable,
      name: e.target.value,
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateTable({
      ...draftTable,
      description: e.target.value,
    });
  };

  const handleRemove = () => {
    onRemoveTable(draftTable.id);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-md">Table: {draftTable.name || "Unnamed Table"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`table-name-${draftTable.id}`}>Name</Label>
          <Input
            id={`table-name-${draftTable.id}`}
            value={draftTable.name}
            onChange={handleNameChange}
            placeholder="Table name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`table-description-${draftTable.id}`}>Description</Label>
          <Textarea
            id={`table-description-${draftTable.id}`}
            value={draftTable.description || ""}
            onChange={handleDescriptionChange}
            placeholder="Table description (optional)"
          />
        </div>
        
        <ColumnList draftObject={draftObject} draftTable={draftTable} />
      </CardContent>
    </Card>
  );
}