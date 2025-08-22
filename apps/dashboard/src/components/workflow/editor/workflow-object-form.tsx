import { useState } from "react";
import type { DraftObject, DraftField, DraftTable } from "@/types";
import { useWorkflowConfig } from "@/contexts/workflow-config-context";
import { ObjectHeader } from "@/components/workflow/editor/object-header";
import { ObjectDescription } from "@/components/workflow/editor/object-description";
import { ObjectActions } from "@/components/workflow/editor/object-actions";
import { EditControls } from "@/components/workflow/editor/edit-controls";
import { FieldsSection } from "@/components/workflow/editor/fields-section";
import { TablesSection } from "@/components/workflow/editor/tables-section";
import { produce } from "immer";

interface WorkflowObjectFormProps {
  object: DraftObject;
}

export function WorkflowObjectForm({ object }: WorkflowObjectFormProps) {
  const { updateObject, removeObject } = useWorkflowConfig();

  const [localObject, setLocalObject] = useState<DraftObject>(object);
  const [isEditing, setIsEditing] = useState(true);

  const handleSave = () => {
    updateObject(localObject);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalObject(object);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setLocalObject(object);
    setIsEditing(true);
  };

  const updateLocalObjectName = (name: string) => {
    setLocalObject(prev => 
      produce(prev, draft => {
        draft.name = name;
      })
    );
  };

  const updateLocalObjectDescription = (description: string) => {
    setLocalObject(prev => 
      produce(prev, draft => {
        draft.description = description;
      })
    );
  };

  const addLocalField = () => {
    setLocalObject(prev => 
      produce(prev, draft => {
        if (!draft.fields) {
          draft.fields = [];
        }
        draft.fields.push({
          id: Date.now().toString(),
          name: "New Field",
          type: "string",
        });
      })
    );
  };

  const addLocalTable = () => {
    setLocalObject(prev => 
      produce(prev, draft => {
        if (!draft.tables) {
          draft.tables = [];
        }
        draft.tables.push({
          id: Date.now().toString(),
          name: "New Table",
          columns: [],
        });
      })
    );
  };

  const removeLocalField = (fieldId: string) => {
    setLocalObject(prev => 
      produce(prev, draft => {
        if (draft.fields) {
          const index = draft.fields.findIndex(field => field.id === fieldId);
          if (index !== -1) {
            draft.fields.splice(index, 1);
          }
        }
      })
    );
  };

  const removeLocalTable = (tableId: string) => {
    setLocalObject(prev => 
      produce(prev, draft => {
        if (draft.tables) {
          const index = draft.tables.findIndex(table => table.id === tableId);
          if (index !== -1) {
            draft.tables.splice(index, 1);
          }
        }
      })
    );
  };

  const updateLocalField = (updatedField: DraftField) => {
    setLocalObject(prev => 
      produce(prev, draft => {
        if (draft.fields) {
          const index = draft.fields.findIndex(field => field.id === updatedField.id);
          if (index !== -1) {
            draft.fields[index] = updatedField;
          }
        }
      })
    );
  };

  const updateLocalTable = (updatedTable: DraftTable) => {
    setLocalObject(prev => 
      produce(prev, draft => {
        if (draft.tables) {
          const index = draft.tables.findIndex(table => table.id === updatedTable.id);
          if (index !== -1) {
            draft.tables[index] = updatedTable;
          }
        }
      })
    );
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <ObjectHeader
        object={localObject}
        isEditing={isEditing}
        localName={localObject.name}
        onNameChange={updateLocalObjectName}
        onRemove={() => removeObject(object.id)}
      />

      <ObjectDescription
        object={localObject}
        isEditing={isEditing}
        localDescription={localObject.description || ""}
        onDescriptionChange={updateLocalObjectDescription}
      />

      <FieldsSection
        objectId={localObject.id}
        fields={localObject.fields || []}
        isEditing={isEditing}
        onFieldUpdate={updateLocalField}
        onFieldRemove={removeLocalField}
        onAddField={addLocalField}
      />

      <TablesSection
        objectId={localObject.id}
        tables={localObject.tables || []}
        isEditing={isEditing}
        onTableUpdate={updateLocalTable}
        onTableRemove={removeLocalTable}
        onAddTable={addLocalTable}
      />

      <ObjectActions
        isEditing={isEditing}
      />

      <EditControls isEditing={isEditing} onSave={handleSave} onCancel={handleCancel} onEdit={handleEdit} />
    </div>
  );
}
