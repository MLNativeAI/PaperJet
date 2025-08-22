export interface DraftField {
  id: string;
  name: string;
  description?: string;
  type: "string" | "date" | "number";
}

export interface DraftColumn {
  id: string;
  name: string;
  description?: string;
  type: "string" | "date" | "number";
}

export interface DraftTable {
  id: string;
  name: string;
  description?: string;
  columns: DraftColumn[];
}

export interface DraftObject {
  id: string;
  name: string;
  description?: string;
  fields?: DraftField[];
  tables?: DraftTable[];
}

export interface DraftWorkflowConfig {
  objects: DraftObject[];
}
