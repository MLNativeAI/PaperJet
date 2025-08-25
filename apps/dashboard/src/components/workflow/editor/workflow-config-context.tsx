import { createContext, useContext, useState } from "react";
import { produce } from "immer";
import type { DraftWorkflowConfig, DraftObject, DraftField } from "@/types";

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
  addTable: (objectId: string) => void;
}

const WorkflowConfigContext = createContext<WorkflowConfigContextType | undefined>(undefined);

export function WorkflowConfigProvider({ children }: { children: React.ReactNode }) {
  const [workflowConfig, setWorkflowConfig] = useState<DraftWorkflowConfig>({ objects: [] });

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

  const addTable = (objectId: string) => {
    const nextState = produce(workflowConfig, (draftState) => {
      const objectIndex = draftState.objects.findIndex((obj) => obj.id === objectId);
      if (objectIndex !== -1) {
        const draft = draftState.objects[objectIndex];
        // Initialize tables array if it doesn't exist
        if (!draft.tables) {
          draft.tables = [];
        }
        draft.tables.push({
          id: Date.now().toString(),
          name: "",
          columns: [],
        });
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
