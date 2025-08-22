import { createContext, useContext, useState } from "react";
import type { DraftObject } from "@/types";
import { useWorkflowConfig } from "@/contexts/workflow-config-context";
import { produce } from "immer";

interface WorkflowConfigContextType {
  draftObject: DraftObject;
  isEditing: boolean;
  startEditing: () => void;
  cancelEditing: () => void;
  finishEditing: () => void;
  updateField: (recipe: (draft: DraftObject) => void) => void;
  deleteObject: () => void;
}

const WorkflowObjectContext = createContext<WorkflowConfigContextType | undefined>(undefined);

export function WorkflowObjectProvider({
  children,
  initialObject,
}: {
  children: React.ReactNode;
  initialObject: DraftObject;
}) {
  const { updateObject, removeObject } = useWorkflowConfig();
  const [workflowObject, setWorkflowObject] = useState<DraftObject>(initialObject);
  const [isEditing, setIsEditing] = useState(true);
  const [originalObject, setOriginalObject] = useState<DraftObject>(initialObject);

  const startEditing = () => {
    setOriginalObject(workflowObject);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setWorkflowObject(originalObject);
    setIsEditing(false);
  };

  const finishEditing = () => {
    console.log("Finishing object edit");
    setIsEditing(false);
    console.log("Setting parent state to: ", workflowObject);
    updateObject(workflowObject);
  };

  function updateField(handler: (draft: DraftObject) => void) {
    setWorkflowObject((prev) => produce(prev, handler));
  }

  function deleteObject() {
    removeObject(workflowObject.id);
  }

  return (
    <WorkflowObjectContext.Provider
      value={{
        draftObject: workflowObject,
        isEditing: isEditing,
        startEditing,
        cancelEditing,
        finishEditing,
        updateField,
        deleteObject,
      }}
    >
      {children}
    </WorkflowObjectContext.Provider>
  );
}

export function useWorkflowObject() {
  const context = useContext(WorkflowObjectContext);
  if (context === undefined) {
    throw new Error("useWorkflowObject must be used within a WorkflowObjectProvider");
  }
  return context;
}
