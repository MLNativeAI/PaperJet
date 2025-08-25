import { createContext, useContext, useState, useEffect } from "react";
import { produce } from "immer";
import type { DraftWorkflowConfig, DraftObject, DraftField } from "@/types";
import type { Workflow } from "@paperjet/engine/types";

interface WorkflowConfigContextType {
  workflowConfig: DraftWorkflowConfig;
  addAnObject: (initialValues?: { name?: string; description?: string }) => void;
  updateObject: (updatedObject: DraftObject) => void;
  removeObject: (objectId: string) => void;
  // Field-level functions
  addField: (objectId: string, newField: DraftField) => void;
  updateField: (objectId: string, fieldId: string, updatedField: DraftField) => void;
  removeField: (objectId: string, fieldId: string) => void;
  // Initialize with existing workflow
  initializeWithWorkflow: (workflow: Workflow) => void;
}

const WorkflowConfigContext = createContext<WorkflowConfigContextType | undefined>(undefined);

export function WorkflowConfigProvider({ 
  children, 
  initialWorkflow 
}: { 
  children: React.ReactNode;
  initialWorkflow?: Workflow;
}) {
  const [workflowConfig, setWorkflowConfig] = useState<DraftWorkflowConfig>({ objects: [] });

  // Initialize with existing workflow data if provided
  useEffect(() => {
    if (initialWorkflow) {
      initializeWithWorkflow(initialWorkflow);
    }
  }, [initialWorkflow]);

  const initializeWithWorkflow = (workflow: Workflow) => {
    const draftObjects: DraftObject[] = workflow.configuration.objects.map(obj => ({
      id: `draft-${obj.name}-${Date.now()}`, // Generate a unique ID for the draft
      name: obj.name,
      description: obj.description || "",
      fields: obj.fields?.map(field => ({
        id: `field-${field.name}-${Date.now()}`,
        name: field.name,
        description: field.description || "",
        type: field.type as "string" | "date" | "number"
      })) || [],
      tables: obj.tables?.map(table => ({
        id: `table-${table.name}-${Date.now()}`,
        name: table.name,
        description: table.description || "",
        columns: table.columns.map(column => ({
          id: `column-${column.name}-${Date.now()}`,
          name: column.name,
          description: column.description || "",
          type: column.type as "string" | "date" | "number"
        }))
      })) || []
    }));
    
    setWorkflowConfig({ objects: draftObjects });
  };

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
        initializeWithWorkflow
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
