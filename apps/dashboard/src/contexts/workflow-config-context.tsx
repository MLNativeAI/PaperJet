import { createContext, useContext, useState } from "react";
import { produce } from "immer";
import type { DraftWorkflowConfig, DraftObject } from "@/types";

interface WorkflowConfigContextType {
  workflowConfig: DraftWorkflowConfig;
  addAnObject: () => void;
  updateObject: (updatedObject: DraftObject) => void;
  removeObject: (objectId: string) => void;
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

  const updateObject = (updatedObject: DraftObject) => {
    const nextState = produce(workflowConfig, (draftState) => {
      const objectIndex = draftState.objects.findIndex(obj => obj.id === updatedObject.id);
      if (objectIndex !== -1) {
        draftState.objects[objectIndex] = updatedObject;
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

  return (
    <WorkflowConfigContext.Provider
      value={{
        workflowConfig,
        addAnObject,
        updateObject,
        removeObject,
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

