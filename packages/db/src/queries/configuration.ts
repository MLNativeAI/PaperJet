import { db } from "../db";
import { modelConfiguration } from "../schema";
import type { DbModelConfiguration } from "../types/tables";

export type RuntimeModelType = "fast" | "accurate";

export type RuntimeConfiguration = {
  fastModel: any;
  accurateModel: any;
};

export const listModels = async (): Promise<DbModelConfiguration[]> => {
  return await db.query.modelConfiguration.findMany();
};

export const addNewModel = async (modelConfig: {
  provider: string;
  providerApiKey: string;
  modelName: string;
  displayName?: string;
  baseUrl?: string;
}) => {
  return await db
    .insert(modelConfiguration)
    .values({
      provider: modelConfig.provider,
      providerApiKey: modelConfig.providerApiKey,
      modelName: modelConfig.modelName,
      displayName: modelConfig.displayName || `${modelConfig.provider}/${modelConfig.modelName}`,
      baseUrl: modelConfig.baseUrl,
    })
    .returning();
};
