import type { ApiRoutes } from "@api/index";
import type { ConfigurationUpdate } from "@paperjet/engine/types";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

export const api = client.api;
export const apiClient = client;

// Workflow API functions
export const getWorkflow = async (workflowId: string) => {
  const response = await api.workflows[":id"].$get({
    param: { id: workflowId },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch workflow");
  }

  return response.json();
};

export const getAnalysisStatus = async (workflowId: string) => {
  const response = await api.workflows[":id"].$get({
    param: { id: workflowId },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch analysis status");
  }

  return response.json();
};

export const analyzeWorkflow = async (workflowId: string) => {
  const response = await api.workflows[":id"].analyze.$post({
    param: { id: workflowId },
  });

  if (!response.ok) {
    throw new Error("Failed to analyze workflow");
  }

  return response.json();
};

// Workflow list API functions
export const getAllWorkflows = async () => {
  const response = await api.workflows.$get();
  if (!response.ok) {
    throw new Error("Failed to fetch workflows");
  }
  return response.json();
};

export const deleteWorkflow = async (workflowId: string) => {
  const response = await api.workflows[":id"].$delete({
    param: { id: workflowId },
  });

  if (!response.ok) {
    throw new Error("Failed to delete workflow");
  }

  return response.json();
};
export const getWorkflowExecutions = async (workflowId: string) => {
  const response = await api.executions.workflow[":workflowId"].$get({
    param: { workflowId },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch executions");
  }
  return response.json();
};
// FormData functions that can't use Hono RPC
export const createWorkflowFromFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/workflows", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to create workflow from file");
  }

  return response.json();
};

export const createWorkflowFromTemplate = async (templateData: {
  slug: string;
  description: string;
  configuration: string;
  categories: string;
  sampleData: string;
  templateFile: File;
}) => {
  const formData = new FormData();
  formData.append("slug", templateData.slug);
  formData.append("description", templateData.description);
  formData.append("configuration", templateData.configuration);
  formData.append("categories", templateData.categories);
  formData.append("sampleData", templateData.sampleData);
  formData.append("templateFile", templateData.templateFile);

  const response = await fetch("/api/workflows/from-template", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to create workflow from template");
  }

  return response.json();
};
// Document API functions
export const getDocument = async (fileId: string) => {
  const response = await api.workflows[":fileId"].document.$get({
    param: { fileId },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch document");
  }

  return response.json();
};

export const isAdminSetupRequired = async () => {
  const response = await api.admin["setup-required"].$get({});
  return response.json();
};

export const getAuthMode = async () => {
  const response = await api.admin["auth-mode"].$get({});
  return response.json();
};

export const getUsageData = async () => {
  const response = await api.admin["usage-data"].$get({});
  return response.json();
};

export const getUsageStats = async () => {
  const response = await api.admin["usage-stats"].$get({});
  return response.json();
};

export const getConfiguration = async () => {
  const response = await api.admin.config.$get({});
  if (!response.ok) {
    throw new Error("Failed to fetch configuration");
  }
  return response.json();
};

export const updateConfiguration = async (config: ConfigurationUpdate) => {
  const response = await api.admin.config.$patch({
    json: config,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update configuration");
  }

  return response.json();
};

export const validateConnection = async (config: ConfigurationUpdate) => {
  const response = await api.admin["validate-connection"].$post({
    json: config,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to validate connection");
  }

  return response.json();
};
