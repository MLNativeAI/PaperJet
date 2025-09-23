export * from "./src/types/executions";
export * from "./src/types/tables";
export * from "./src/types/workflow-config";

export type RuntimeModelType = "fast" | "accurate";

export type RuntimeModel = {
  name: string;
  modelId: string;
};

export type RuntimeConfiguration = {
  fastModel: RuntimeModel | null;
  accurateModel: RuntimeModel | null;
};
