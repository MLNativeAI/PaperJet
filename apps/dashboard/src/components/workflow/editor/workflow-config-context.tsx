import type { Workflow } from "@paperjet/engine/types";
import { produce } from "immer";
import { createContext, useContext, useEffect, useState } from "react";
import { type DraftField, type DraftObject, type DraftTable, type DraftWorkflowConfig, fromWorkflowConfig } from "@/types";

interface WorkflowConfigContextType {
  workflowConfig: DraftWorkflowConfig;
  addAnObject: (initialValues?: { name?: string; description?: string }) => void;
  updateObject: (updatedObject: DraftObject) => void;
  removeObject: (objectId: string) => void;
  // Field-level functions
  addField: (objectId: string, newField: DraftField) => void;
  updateField: (objectId: string, fieldId: string, updatedField: DraftField) => void;
  removeField: (objectId: string, fieldId: string) => void;
  // Table-level functions
  addTable: (objectId: string, newTable: DraftTable) => void;
  updateTable: (objectId: string, tableId: string, updatedTable: DraftTable) => void;
  removeTable: (objectId: string, tableId: string) => void;
}

const WorkflowConfigContext = createContext<WorkflowConfigContextType | undefined>(undefined);

export function WorkflowConfigProvider({
  children,
  initialWorkflow,
}: {
  children: React.ReactNode;
  initialWorkflow?: Workflow;
}) {
  const [workflowConfig, setWorkflowConfig] = useState<DraftWorkflowConfig>({ objects: [] });

  useEffect(() => {
    if (initialWorkflow) {
      setWorkflowConfig({ objects: fromWorkflowConfig(initialWorkflow.configuration) });
    }
  }, [initialWorkflow]);

  const addAnObject = (initialValues?: { name?: string; description?: string }) => {
    const nextState = produce(workflowConfig, (draftState) => {
      draftState.objects.push({
        id: Date.now().toString(),
        name: initialValues?.name || "",
        description: initialValues?.description || "",
        fields: [],
        tables: [],
      });
    });
    setWorkflowConfig(nextState);
  };

  const updateObject = (updatedObject: DraftObject) => {
    const nextState = produce(workflowConfig, (draftState) => {
      const objectIndex = draftState.objects.findIndex((obj) => obj.id === updatedObject.id);
      if (objectIndex !== -1) {
        draftState.objects[objectIndex] = updatedObject;
      }
    });
    setWorkflowConfig(nextState);
  };

  const removeObject = (objectId: string) => {
    const nextState = produce(workflowConfig, (draftState) => {
      const index = draftState.objects.findIndex((obj) => obj.id === objectId);
      if (index !== -1) {
        draftState.objects.splice(index, 1);
      }
    });
    setWorkflowConfig(nextState);
  };

  const addField = (objectId: string, newField: DraftField) => {
    const nextState = produce(workflowConfig, (draftState) => {
      const objectIndex = draftState.objects.findIndex((obj) => obj.id === objectId);
      if (objectIndex !== -1) {
        const draft = draftState.objects[objectIndex];
        if (!draft.fields) {
          draft.fields = [];
        }
        draft.fields.push(newField);
      }
    });
    setWorkflowConfig(nextState);
  };

  const updateField = (objectId: string, fieldId: string, updatedField: DraftField) => {
    const nextState = produce(workflowConfig, (draftState) => {
      const objectIndex = draftState.objects.findIndex((obj) => obj.id === objectId);
      if (objectIndex !== -1) {
        const draft = draftState.objects[objectIndex];
        if (draft.fields) {
          const fieldIndex = draft.fields.findIndex((f) => f.id === fieldId);
          if (fieldIndex !== -1) {
            draft.fields[fieldIndex] = updatedField;
          }
        }
      }
    });
    setWorkflowConfig(nextState);
  };

  const removeField = (objectId: string, fieldId: string) => {
    console.log(`Removing ${objectId} ${fieldId}`);
    const nextState = produce(workflowConfig, (draftState) => {
      const objectIndex = draftState.objects.findIndex((obj) => obj.id === objectId);
      if (objectIndex !== -1) {
        const draft = draftState.objects[objectIndex];
        if (draft.fields) {
          const fieldIndex = draft.fields.findIndex((f) => f.id === fieldId);
          if (fieldIndex !== -1) {
            draft.fields.splice(fieldIndex, 1);
          }
        }
      }
    });
    setWorkflowConfig(nextState);
  };

  const addTable = (objectId: string, newTable: DraftTable) => {
    const nextState = produce(workflowConfig, (draftState) => {
      const objectIndex = draftState.objects.findIndex((obj) => obj.id === objectId);
      if (objectIndex !== -1) {
        const draft = draftState.objects[objectIndex];
        if (!draft.tables) {
          draft.tables = [];
        }
        draft.tables.push(newTable);
      }
    });
    setWorkflowConfig(nextState);
  };

  const updateTable = (objectId: string, tableId: string, updatedTable: DraftTable) => {
    const nextState = produce(workflowConfig, (draftState) => {
      const objectIndex = draftState.objects.findIndex((obj) => obj.id === objectId);
      if (objectIndex !== -1) {
        const draft = draftState.objects[objectIndex];
        if (draft.tables) {
          const tableIndex = draft.tables.findIndex((t) => t.id === tableId);
          if (tableIndex !== -1) {
            draft.tables[tableIndex] = updatedTable;
          }
        }
      }
    });
    setWorkflowConfig(nextState);
  };

  const removeTable = (objectId: string, tableId: string) => {
    const nextState = produce(workflowConfig, (draftState) => {
      const objectIndex = draftState.objects.findIndex((obj) => obj.id === objectId);
      if (objectIndex !== -1) {
        const draft = draftState.objects[objectIndex];
        if (draft.tables) {
          const tableIndex = draft.tables.findIndex((t) => t.id === tableId);
          if (tableIndex !== -1) {
            draft.tables.splice(tableIndex, 1);
          }
        }
      }
    });
    setWorkflowConfig(nextState);
  };

  return (
    <WorkflowConfigContext.Provider
      value={{
        workflowConfig,
        addAnObject,
        updateObject,
        removeObject,
        addField,
        updateField,
        removeField,
        addTable,
        updateTable,
        removeTable,
      }}
    >
      {children}
    </WorkflowConfigContext.Provider>
  );
}

export function useWorkflowConfig() {
  const context = useContext(WorkflowConfigContext);
  if (context === undefined) {
    throw new Error("useWorkflowConfig must be used within a WorkflowConfigProvider");
  }
  return context;
}
