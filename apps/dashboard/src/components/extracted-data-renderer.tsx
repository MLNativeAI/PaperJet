import type { ExtractedDataType } from "@paperjet/engine/types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ExtractedDataField } from "./extracted-data-field";
import { ExtractedDataTable } from "./extracted-data-table";

interface ExtractedDataRendererProps {
  data: ExtractedDataType;
}

export function ExtractedDataRenderer({ data }: ExtractedDataRendererProps) {
  const [expandedObjects, setExpandedObjects] = useState<Set<string>>(new Set());

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Extracted Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No data extracted yet</p>
        </CardContent>
      </Card>
    );
  }

  const toggleObjectExpansion = (objectName: string) => {
    setExpandedObjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(objectName)) {
        newSet.delete(objectName);
      } else {
        newSet.add(objectName);
      }
      return newSet;
    });
  };

  const objectEntries = Object.entries(data);

  if (objectEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Extracted Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No data extracted</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {objectEntries.map(([objectName, objectData]) => {
        const isExpanded = expandedObjects.has(objectName);
        const hasFields = objectData.fields && Object.keys(objectData.fields).length > 0;
        const hasTables = objectData.tables && Object.keys(objectData.tables).length > 0;
        const hasContent = hasFields || hasTables;

        if (!hasContent) {
          return null;
        }

        return (
          <Card key={objectName}>
            <Collapsible open={isExpanded} onOpenChange={() => toggleObjectExpansion(objectName)}>
              <CardHeader>
                <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity">
                  <CardTitle className="flex items-center gap-2">
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    {objectName}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {hasFields && `${Object.keys(objectData.fields).length} fields`}
                    {hasFields && hasTables && ", "}
                    {hasTables && `${Object.keys(objectData.tables).length} tables`}
                  </span>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-6">
                  {hasFields && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-muted-foreground">Fields</h4>
                      <div className="grid gap-3 md:grid-cols-2">
                        {Object.entries(objectData.fields).map(([fieldName, fieldValue]) => (
                          <ExtractedDataField key={fieldName} name={fieldName} value={fieldValue} />
                        ))}
                      </div>
                    </div>
                  )}

                  {hasTables && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-muted-foreground">Tables</h4>
                      <div className="space-y-4">
                        {Object.entries(objectData.tables).map(([tableName, tableData]) => (
                          <ExtractedDataTable key={tableName} name={tableName} data={tableData} />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
}
