import { Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DraftTable } from "@/types";

interface TableViewProps {
  table: DraftTable;
  onEdit: () => void;
  onRemove: () => void;
}

export function TableView({ table, onEdit, onRemove }: TableViewProps) {
  return (
    <div className="flex items-center justify-between p-2 bg-muted rounded">
      <div>
        <span className="font-medium">{table.name}</span>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="text-muted-foreground hover:text-foreground"
        >
          Edit
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
    </div>
  );
}