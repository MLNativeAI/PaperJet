import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FieldList } from "@/components/workflow/editor/field-list";
import { ObjectActions } from "@/components/workflow/editor/object-actions";
import { ObjectHeader } from "@/components/workflow/editor/object-header";
import type { DraftObject } from "@/types";

export function WorkflowObjectForm({ draftObject }: { draftObject: DraftObject }) {
  return (
    <Card>
      <CardHeader>
        <ObjectHeader draftObject={draftObject} />
        <Separator />
      </CardHeader>
      <CardContent>
        <div className="py-4 space-y-6">
          <FieldList draftObject={draftObject} />
          <ObjectActions draftObject={draftObject} />
        </div>
      </CardContent>
    </Card>
  );
}
