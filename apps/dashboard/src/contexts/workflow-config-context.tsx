import { createContext, useContext, useState } from "react";
import { produce } from "immer";
import type { DraftWorkflowConfig } from "@/types";

interface WorkflowConfigContextType {
  workflowConfig: DraftWorkflowConfig;
  addAnObject: () => void;
  updateObjectName: (objectId: string, name: string) => void;
  updateObjectDescription: (objectId: string, description: string) => void;
  addObjectField: (objectId: string) => void;
  addObjectTable: (objectId: string) => void;
  removeObject: (objectId: string) => void;
  removeField: (objectId: string, fieldId: string) => void;
  removeTable: (objectId: string, tableId: string) => void;
}

const WorkflowConfigContext = createContext<WorkflowConfigContextType | undefined>(undefined);

export function WorkflowConfigProvider({ children }: { children: React.ReactNode }) {
  const [workflowConfig, setWorkflowConfig] = useState<DraftWorkflowConfig>({ objects: [] });

  const addAnObject = () => {
    const nextState = produce(workflowConfig, (draftState) => {
      draftState.objects.push({
        id: Date.now().toString(),
        name: "New Object",
        description: "",
        fields: [],
        tables: [],
      });
    });
    setWorkflowConfig(nextState);
  };

  const updateObjectName = (objectId: string, name: string) => {
    const nextState = produce(workflowConfig, (draftState) => {
      const object = draftState.objects.find(obj => obj.id === objectId);
      if (object) {
        object.name = name;
      }
    });
    setWorkflowConfig(nextState);
  };

  const updateObjectDescription = (objectId: string, description: string) => {
    const nextState = produce(workflowConfig, (draftState) => {
      const object = draftState.objects.find(obj => obj.id === objectId);
      if (object) {
        object.description = description;
      }
    });
    setWorkflowConfig(nextState);
  };

  const addObjectField = (objectId: string) => {
    const nextState = produce(workflowConfig, (draftState) => {
      const object = draftState.objects.find(obj => obj.id === objectId);
      if (object) {
        object.fields = object.fields || [];
        object.fields.push({
          id: Date.now().toString(),
          name: "New Field",
          type: "string",
        });
      }
    });
    setWorkflowConfig(nextState);
  };

  const addObjectTable = (objectId: string) => {
    const nextState = produce(workflowConfig, (draftState) => {
      const object = draftState.objects.find(obj => obj.id === objectId);
      if (object) {
        object.tables = object.tables || [];
        object.tables.push({
          id: Date.now().toString(),
          name: "New Table",
          columns: [],
        });
      }
    });
    setWorkflowConfig(nextState);
  };

  const removeObject = (objectId: string) => {
    const nextState = produce(workflowConfig, (draftState) => {
      const index = draftState.objects.findIndex(obj => obj.id === objectId);
      if (index !== -1) {
        draftState.objects.splice(index, 1);
      }
    });
    setWorkflowConfig(nextState);
  };

  const removeField = (objectId: string, fieldId: string) => {
    const nextState = produce(workflowConfig, (draftState) => {
      const object = draftState.objects.find(obj => obj.id === objectId);
      if (object && object.fields) {
        const index = object.fields.findIndex(field => field.id === fieldId);
        if (index !== -1) {
          object.fields.splice(index, 1);
        }
      }
    });
    setWorkflowConfig(nextState);
  };

  const removeTable = (objectId: string, tableId: string) => {
    const nextState = produce(workflowConfig, (draftState) => {
      const object = draftState.objects.find(obj => obj.id === objectId);
      if (object && object.tables) {
        const index = object.tables.findIndex(table => table.id === tableId);
        if (index !== -1) {
          object.tables.splice(index, 1);
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
        updateObjectName,
        updateObjectDescription,
        addObjectField,
        addObjectTable,
        removeObject,
        removeField,
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

