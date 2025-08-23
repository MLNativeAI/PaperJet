import { ObjectDescription } from "@/components/workflow/editor/object-description";
import { ObjectHeader } from "@/components/workflow/editor/object-header";
import { FieldList } from "@/components/workflow/editor/field-list";
import type { DraftObject } from "@/types";

export function WorkflowObjectForm({ draftObject }: { draftObject: DraftObject }) {
  return (
    <div className="p-4 border rounded-lg space-y-6">
      <ObjectHeader draftObject={draftObject} />
      <ObjectDescription draftObject={draftObject} />
      <FieldList draftObject={draftObject} />
    </div>
  );
}
