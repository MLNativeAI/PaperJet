import { useState, useEffect } from "react";
import type { DraftObject } from "@/types";
import { useWorkflowConfig } from "@/contexts/workflow-config-context";
import { ObjectHeader } from "@/components/object-header";
import { ObjectDescription } from "@/components/object-description";
import { ObjectActions } from "@/components/object-actions";
import { EditControls } from "@/components/edit-controls";
import { FieldsSection } from "@/components/fields-section";
import { TablesSection } from "@/components/tables-section";
import { produce } from "immer";

interface WorkflowObjectFormProps {
  object: DraftObject;
}

interface LocalObjectState {
  name: string;
  description: string;
}

export function WorkflowObjectForm({ object }: WorkflowObjectFormProps) {
  const { 
    updateObjectName, 
    updateObjectDescription, 
    addObjectField, 
    addObjectTable, 
    removeObject,
    removeField,
    removeTable
  } = useWorkflowConfig();

  const [localObject, setLocalObject] = useState<LocalObjectState>({
    name: object.name,
    description: object.description || "",
  });

  const [isEditing, setIsEditing] = useState(true);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingTableId, setEditingTableId] = useState<string | null>(null);

  useEffect(() => {
    setLocalObject({
      name: object.name,
      description: object.description || "",
    });
  }, [object.name, object.description]);

  const handleSave = () => {
    updateObjectName(object.id, localObject.name);
    updateObjectDescription(object.id, localObject.description);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalObject({
      name: object.name,
      description: object.description || "",
    });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setLocalObject({
      name: object.name,
      description: object.description || "",
    });
    setIsEditing(true);
  };

  const handleFieldEdit = (fieldId: string) => {
    setEditingFieldId(fieldId);
    setEditingTableId(null);
  };

  const handleTableEdit = (tableId: string) => {
    setEditingTableId(tableId);
    setEditingFieldId(null);
  };

  const handleFieldSave = () => {
    setEditingFieldId(null);
  };

  const handleTableSave = () => {
    setEditingTableId(null);
  };

  const handleFieldCancel = () => {
    setEditingFieldId(null);
  };

  const handleTableCancel = () => {
    setEditingTableId(null);
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <ObjectHeader
        object={object}
        isEditing={isEditing}
        localName={localObject.name}
        onNameChange={(name) => 
          setLocalObject((prev) =>
            produce(prev, (draft) => {
              draft.name = name;
            }),
          )
        }
        onRemove={() => removeObject(object.id)}
      />

      <ObjectDescription
        object={object}
        isEditing={isEditing}
        localDescription={localObject.description}
        onDescriptionChange={(description) =>
          setLocalObject((prev) =>
            produce(prev, (draft) => {
              draft.description = description;
            }),
          )
        }
      />

      <FieldsSection
        objectId={object.id}
        fields={object.fields || []}
        editingFieldId={editingFieldId}
        onFieldEdit={handleFieldEdit}
        onFieldSave={handleFieldSave}
        onFieldCancel={handleFieldCancel}
        onFieldRemove={(fieldId) => removeField(object.id, fieldId)}
      />

      <TablesSection
        objectId={object.id}
        tables={object.tables || []}
        editingTableId={editingTableId}
        onTableEdit={handleTableEdit}
        onTableSave={handleTableSave}
        onTableCancel={handleTableCancel}
        onTableRemove={(tableId) => removeTable(object.id, tableId)}
      />

      <ObjectActions
        isEditing={isEditing}
        onAddField={() => addObjectField(object.id)}
        onAddTable={() => addObjectTable(object.id)}
      />

      <EditControls
        isEditing={isEditing}
        onSave={handleSave}
        onCancel={handleCancel}
        onEdit={handleEdit}
      />
    </div>
  );
}
