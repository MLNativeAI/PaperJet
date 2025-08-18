import { Calendar, Hash, Type } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExtractedDataFieldProps {
  name: string;
  value: string | number | Date | null;
}

export function ExtractedDataField({ name, value }: ExtractedDataFieldProps) {
  const getFieldType = (value: string | number | Date | null) => {
    if (value === null || value === undefined) return "empty";
    if (typeof value === "number") return "number";
    if (value instanceof Date) return "date";

    const stringValue = String(value);

    const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;
    if (dateRegex.test(stringValue)) return "date";

    const numberRegex = /^-?\d+(\.\d+)?$/;
    if (numberRegex.test(stringValue)) return "number";

    return "string";
  };

  const formatValue = (value: string | number | Date | null) => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">Not provided</span>;
    }

    const type = getFieldType(value);

    switch (type) {
      case "date":
        try {
          const date = value instanceof Date ? value : new Date(String(value));
          return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            ...(String(value).includes("T")
              ? {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              : {}),
          }).format(date);
        } catch {
          return String(value);
        }
      default:
        return String(value);
    }
  };

  const getFieldIcon = (value: string | number | Date | null) => {
    const type = getFieldType(value);
    switch (type) {
      case "date":
        return <Calendar className="h-3 w-3" />;
      case "number":
        return <Hash className="h-3 w-3" />;
      default:
        return <Type className="h-3 w-3" />;
    }
  };

  return (
    <div className="flex flex-col space-y-1 p-3 bg-muted/30 rounded-lg border">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          {getFieldIcon(value)}
          {name}
        </span>
      </div>
      <div className="text-sm font-medium">{formatValue(value)}</div>
    </div>
  );
}
