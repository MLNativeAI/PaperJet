import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { DraftObject, DraftTable, DraftColumn } from "@/types";
import { Trash2 } from "lucide-react";

interface ColumnFormProps {
  draftObject: DraftObject;
  draftTable: DraftTable;
  draftColumn: DraftColumn;
  onUpdateColumn: (updatedColumn: DraftColumn) => void;
  onRemoveColumn: (columnId: string) => void;
}

export function ColumnForm({
  draftObject,
  draftTable,
  draftColumn,
  onUpdateColumn,
  onRemoveColumn,
}: ColumnFormProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateColumn({
      ...draftColumn,
      name: e.target.value,
    });
  };

  const handleTypeChange = (value: string) => {
    onUpdateColumn({
      ...draftColumn,
      type: value as "string" | "date" | "number",
    });
  };

  const handleRemove = () => {
    onRemoveColumn(draftColumn.id);
  };

  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor={`column-name-${draftColumn.id}`}>Column</Label>
          <Button variant="ghost" size="icon" onClick={handleRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 space-y-2">
            <Input
              id={`column-name-${draftColumn.id}`}
              value={draftColumn.name}
              onChange={handleNameChange}
              placeholder="Column name"
            />
          </div>
          <div className="space-y-2">
            <Select value={draftColumn.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="number">Number</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}