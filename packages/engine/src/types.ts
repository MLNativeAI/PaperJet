import type { DbWorkflowExecution } from "@paperjet/db/types";
import z from "zod";
import type { WorkflowConfiguration } from "./types/workflow-config";

export type ConnectionValidationResult = {
  isValid: boolean;
  error: string | null;
};

export type Configuration = {
  modelType: ModelType;
  geminiApiKey?: string;
  customModelUrl?: string;
  customModelName?: string;
  customModelToken?: string;
  structuredOutputMode?: "json" | "tool";
};

export type ValidModelConfig =
  | {
      type: "cloud";
      geminiApiKey: string;
    }
  | {
      type: "custom";
      customModelUrl: string;
      customModelName: string;
      customModelToken?: string;
      structuredOutputMode: "json" | "tool";
    };

export type ModelType = "cloud" | "custom";

export const configUpdateSchema = z.object({
  modelType: z.enum(["cloud", "custom"]),
  geminiApiKey: z.string().optional(),
  customModelName: z.string().optional(),
  customModelToken: z.string().optional(),
  customModelUrl: z.string().optional(),
  structuredOutputMode: z.enum(["json", "tool"]).optional(),
});

export type ConfigurationUpdate = z.infer<typeof configUpdateSchema>;

export type PdfSplitResult = {
  success: boolean;
  total_pages: number;
  pages: {
    page_number: number;
    image_data: string;
    width: number;
    height: number;
  }[];
};

export type IDReference = {
  userId?: string;
  workflowId?: string;
  executionId?: string;
};

export const categoriesConfigurationSchema = z.array(
  z.object({
    categoryId: z.string(),
    slug: z.string(),
    displayName: z.string(),
    ordinal: z.number(),
  }),
);

export type CategoriesConfiguration = z.infer<typeof categoriesConfigurationSchema>;

export const fieldsConfigurationSchema = z.array(
  z.object({
    id: z.string(),
    slug: z.string(),
    description: z.string(),
    type: z.enum(["text", "number", "date", "currency", "boolean"]),
    required: z.boolean(),
    categoryId: z.string(),
    lastModified: z.string().datetime().optional(),
  }),
);

export type FieldsConfiguration = z.infer<typeof fieldsConfigurationSchema>;

export const tableConfigurationSchema = z.array(
  z.object({
    id: z.string(),
    columns: z.array(
      z.object({
        id: z.string(),
        slug: z.string(),
        description: z.string(),
        type: z.enum(["text", "number", "date", "currency", "boolean"]),
      }),
    ),
    slug: z.string(),
    description: z.string(),
    categoryId: z.string(),
    lastModified: z.string().datetime().optional(),
  }),
);

export type TableConfiguration = z.infer<typeof tableConfigurationSchema>;

export const zodWorkflowField = z.object({
  name: z.string(),
  type: z.enum(["string", "date", "number", "boolean"]),
  description: z.string().optional(),
});

export const zodWorkflowObject = z.object({
  name: z.string(),
  fields: z.array(zodWorkflowField),
});
export type Workflow = {
  id: string;
  name: string;
  description: string;
  configuration: WorkflowConfiguration;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
};

export const WorkflowExecutionStatus = z.enum(["Queued", "Processing", "Failed", "Completed"]);
export type WorkflowExecutionStatus = z.infer<typeof WorkflowExecutionStatus>;

export type WorkflowRun = Omit<DbWorkflowExecution, "ownerId"> & {
  filename: string;
  workflowName: string;
  categories: CategoriesConfiguration;
};

export type UsageData = {
  id: string;
  name: string;
  model: string;
  userId: string | null;
  userEmail: string | null;
  workflowId: string | null;
  executionId: string | null;
  totalTokens: number;
  totalCost: number;
  durationMs: number;
  createdAt: string;
};

export type UsageStats = {
  timePeriod: "30days";
  cost: number;
  requests: number;
  users: number;
  executions: number;
};

export type ApiKey = {
  id: string;
  name: string | null;
  key: string;
  userId: string;
  enabled: boolean;
  createdAt: string;
  lastRequest: string | null;
};

export * from "./types/executions";
export * from "./types/workflow-config";
